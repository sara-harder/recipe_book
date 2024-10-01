import pymupdf
import re

# define the constants
unicode_fractions = {
    '¾': 0.75,
    '⅔': 0.666,
    '½': 0.5,
    '⅓': 0.333,
    '¼': 0.25,
    '⅙': 0.166,
    '⅛': 0.125,
}

units = {
    'mg': ['mg', 'milligram', 'milligrams'],
    'g': ['g', 'gram', 'grams'],
    'kg': ['kg', 'kilogram', 'kilograms'],
    'ml': ['ml', 'milliliter', 'milliliters'],
    'cl': ['cl', 'centiliter', 'centiliters'],
    'dl': ['dl', 'deciliter', 'deciliters'],
    'l': ['l', 'liter', 'liters'],
    'tsp': ['tsp', 'teaspoon', 'teaspoons'],
    'tbsp': ['tbsp', 'tblsp', 'tablespoon', 'tablespoons'],
    ' cup(s)': ['cup', 'cups'],
    'lb': ['lb', 'lbs', 'pound', 'pounds'],
    'oz': ['oz', 'ounce', 'ounces'],
    'fl oz': ['fl oz', 'fluid ounce', 'fluid ounces'],
    ' pint(s)': ['pint', 'pints'],
    ' quart(s)': ['quart', 'quarts'],
    ' gallon(s)': ['gallon', 'gallons'],
    ' small': ['small', 'sm'],
    ' medium': ['medium', 'md', 'med'],
    ' large': ['large', 'lg', 'lrg'],
    ' clove(s)': ['clove', 'cloves'],
    ' slice(s)': ['slice', 'slices'],
    ' cube(s)': ['cube', 'cubes']
}


def read_text(pdf_data):
    """Takes a pdf file and reads it page by page. Removes web-generated page headers and footers for safari, firefox,
    edge, and chrome. Adds each modified page to a long string of text. Identifies the title of the recipe as the very
    first line of the first page. Returns the title and the string of text"""

    doc = pymupdf.open(stream=pdf_data, filetype='pdf')

    text = ''
    title = ''
    for page in doc:
        pg = page.get_text(sort=True)
        if pg == '':
            continue

        # pdfs generated from safari, edge, and chrome start with a line including date, time, and title on each page
        # remove line for date and time and line for title
        idx = pg.index('\n')
        date = re.search(r"\d+/\d+/\d+.*\d+:\d+", pg[:idx])
        if date is not None:
            pg = pg[pg.index('\n', idx + 1) + 1:]

        # pdfs generated from firefox start with a line including title and url on each page
        # remove line for url and title
        else:
            idx = pg.index('\n', idx+1) + 1
            url = re.search(r"https://.*\n", pg[:idx])
            if url is not None:
                pg = pg[idx:]

        # pdfs generated from safari and firefox end with a line including page x of y
        # remove line for page number and URL/date-time
        end_page = re.search(r"(page\s*)?\d+\s*of\s*\d+\n", pg, re.IGNORECASE)
        if end_page is not None:
            pg = pg[:end_page.start()]

        # pdfs generated from chrome and edge end with a line including the url and page x/y
        # remove line for page number and URL
        else:
            end_page = re.search(r"https://.*\n", pg)
            if end_page is not None:
                pg = pg[:end_page.start()]

        # add the page to the overall string of text
        text += pg

        # retrieve the title (must be the first line of the page, after removing pdf headers)
        if title == '':
            title = pg[:pg.index('\n')]

    return title, text


def find_text_occurrences(text, regex):
    """Takes a string of text and a regex pattern. Finds all occurrences of that pattern within the text. For recipe
    purposes, function is only used to identify section headers. As such, only occurrences where a new line starts
    immediately after the occurrence are included in results. Returns a list of occurrences"""

    # retrieve the occurrences of the provided pattern in the recipe
    matches = re.finditer(regex, text, re.IGNORECASE)
    occurrences = []
    for match in matches:
        # only selects occurrences where new line starts immediately afterwards
        end = re.search(r"\s*\n", text[match.end():])
        if end is not None and end.start() == 0:
            occurrences.append(match)

    return occurrences


def compare_occurrences(occurrences_1, occurrences_2):
    """Takes two lists of regex match objects. Iterates over the two lists using two pointers to find the occurrences
    where an occurrence from occurrence_1 occurs immediately before an occurrence in occurrence_2 in the text. Returns
    two lists, one of the identified first occurrences, one of the identified second occurrences that match the pattern.
    These lists should be identical in length

    Example: 'ingredients' occurs 3 times in the text. The first 2 times are before the first occurrence of
    'instructions'. The last time comes after the first and second occurrences of 'instructions', but before the
    third. The function would return [the second occurrence of 'ingredients', the third occurrence of 'ingredients']
    and [the first occurrence of 'instructions', the third occurrence of 'instructions']."""

    matches_1 = []
    matches_2 = []
    pointer_1 = 0
    pointer_2 = 0
    previous = None

    # iterate over occurrences_1 and 2 simultaneously
    while pointer_1 < len(occurrences_1) and pointer_2 < len(occurrences_2):

        # increment the pointer in occurrences_1 until the index of occurrences_1
        #   passes the current index in occurrences_2
        while pointer_1 < len(occurrences_1) and occurrences_1[pointer_1].end() < occurrences_2[pointer_2].end():
            previous = occurrences_1[pointer_1]
            pointer_1 += 1

        # store the val in occurrence_1 that we just passed and the val in occurrence_2 that comes immediately after
        if previous is not None:
            matches_1.append(previous)
            matches_2.append(occurrences_2[pointer_2])

        # increment the pointer in occurrences_2 until the index of occurrences_2
        #   passes the current index in occurrences_1
        while pointer_1 < len(occurrences_1) and pointer_2 < len(occurrences_2) \
                and occurrences_2[pointer_2].end() < occurrences_1[pointer_1].end():
            pointer_2 += 1

    return matches_1, matches_2


def get_recipe_bounds(text):
    """Takes the string of text and evaluates where the ingredients and instructions start and end. Returns the
    corresponding indices
    Calls: find_text_occurrences, compare_occurrences"""

    # retrieve all occurrences of ingredient and instruction headers,
    #   as well as potential headers signalling end of instructions
    ingredient_occurrences = find_text_occurrences(text, r"ingredient\w*\b(\(\w*\)\b)?")
    instruction_occurrences = find_text_occurrences(text, r"instruction\w*\b|direction\w*\b|method\w*\b")
    end_occurrences = find_text_occurrences(text, r"notes\w*\b|serving\w*\b|end\w*\b|video\w*\b")

    # if ingredient header or instruction header not successfully identified, return None
    if len(ingredient_occurrences) < 1:
        print("Couldn't identify ingredients in this recipe")
        return None
    if len(instruction_occurrences) < 1:
        print("Couldn't identify instructions in this recipe")
        return None

    # if there are more than 1 occurrences of the ingredient or instruction headers,
    #   run comparison to identify only occurrences where ingredient comes immediately before instruction
    if len(ingredient_occurrences) > 1 or len(instruction_occurrences) > 1:
        ingredient_occurrences, instruction_occurrences = \
            compare_occurrences(ingredient_occurrences, instruction_occurrences)

    # if there is a header signalling the end of instructions,
    #   run comparison to identify only occurrences where end header comes immediately after instruction
    if len(end_occurrences) > 0:
        instruction_occurrences_b, end_occurrences = compare_occurrences(instruction_occurrences, end_occurrences)

        # if some instruction occurrences were weeded out, weed out the ingredient occurrences in the same location
        if len(instruction_occurrences_b) != len(instruction_occurrences):
            # find indexes of weeded out occurrences
            to_remove = []
            for idx in range(len(instruction_occurrences)):
                occurrence = instruction_occurrences[idx]
                if occurrence not in instruction_occurrences_b:
                    to_remove.append(idx)

            # for each identified index, remove ingredient occurrence
            r = 0
            for idx in to_remove:
                idx = idx - r
                ingredient_occurrences.pop(idx)
                r += 1

            instruction_occurrences = instruction_occurrences_b

    # if combo of ingredient, instruction, and optional end not successfully identified, return None
    if len(ingredient_occurrences) < 1 or len(instruction_occurrences) < 1:
        print("Couldn't distinguish ingredients and instructions in this recipe")
        return None

    # establish variables for lists start and end
    # if there is more than one combination of instruction, ingredient, end headers, use the last found
    ingredients_start = ingredient_occurrences[-1].end()
    ingredients_end, instructions_start = instruction_occurrences[-1].span()
    if len(end_occurrences) > 0:
        instructions_end = end_occurrences[-1].start()
    else:
        instructions_end = -1

    return ingredients_start, ingredients_end, instructions_start, instructions_end


def get_quantity(ingredient):
    """Given an ingredient string, identifies what part of that string indicates the quantity. Checks for fractions and
    or symbols. Returns the quantity"""

    # find the ingredient's quantity by checking for digits and optional unicode fraction
    number = re.search(r"(\d+\s*)([¾⅔½⅓¼⅙⅛])?\s*", ingredient)
    if number is None:
        # case where number is only unicode with no preceding digits
        number = re.search(r"()([¾⅔½⅓¼⅙⅛])\s*", ingredient)

    char_fraction = None

    if number is not None:
        # check if it has an 'or' or a '–' within quantity. First of two options is always used
        or_symbol = re.search(r"–\s*\d+\s*|-\s*\d+\s*|or\s*\d+\s*", ingredient[number.end():])

        # if there is a unicode fraction, convert to a float using unicode_fractions dictionary
        if number.group(2) is not None:
            fraction = unicode_fractions[number.group(2)]

            # resulting quantity is digit + fraction or just fraction if no digit
            if number.group(1) != '':
                quantity = int(number.group(1)) + fraction
            else:
                quantity = fraction

        # if no unicode fraction, check if fraction is written out with chars
        else:
            char_fraction = re.search(r"(\d+)(/)(\d+)\s*", ingredient)

            # if there is a character fraction, convert to a float by dividing top and bottom ints
            if char_fraction is not None:
                fraction = int(char_fraction.group(1)) / int(char_fraction.group(3))

                # determine how to compose quantity based on where char_fraction starts

                # if start is same as start of digits, then there is only fraction, no preceding digits
                if char_fraction.start() == number.start():
                    quantity = fraction

                # if fraction starts immediately after digits end (space between), they need combining
                elif char_fraction.start() == number.end():
                    quantity = int(number.group(1)) + fraction

                # if there is an or symbol and the fraction comes after, only use the digits before symbol
                #   but don't set fraction to None to maintain end of quantity section as end of fraction
                elif or_symbol is not None and char_fraction.start() == or_symbol.end():
                    quantity = int(number.group(1))

                # fraction does not appear next to digits, so it is discounted
                else:
                    quantity = int(number.group(1))
                    char_fraction = None

            # no types of fraction found, so resulting quantity is just first digit
            else:
                quantity = int(number.group(1))

        # setup for getting unit / name after quantity
        # determine last index of quantity section
        if char_fraction is not None:
            num_end = char_fraction.end()
        elif or_symbol is not None:
            num_end = or_symbol.end() + number.end()
        else:
            num_end = number.end()

        return quantity, number.start(), num_end
    return None, None, None


def get_unit(ingredient, num_end):
    """Given an ingredient string and the index of the end of the quantity section, identifies what part of that string
    indicates the unit. Replaces the provided unit with a standardized unit from the unit dictionary. Returns the unit"""

    # the unit is one word that comes immediately after quantity
    chars = ingredient[num_end:]
    unit_match = re.search(r".\b", chars)
    unit = chars[:unit_match.end()]

    # the end index of the unit section is the length of the unit word plus a space
    unit_end = len(unit) + 1

    # format the unit word to allow it to match with the dictionary
    unit = unit.lower()
    unit = unit.replace('.', '')

    # find the unit within the unit dictionary and replace it with the corresponding standardized unit key
    found = False
    for possible in units:
        if unit in units[possible]:
            unit = possible
            found = True
            break

    if not found:
        unit = None
        unit_end = 0

    return unit, unit_end


def get_name(ingredient, num_start, unit_end):
    """Given an ingredient string, the index of the start of the quantity section, and the index of the end of the unit
    section, identifies what part of that string indicates the name. Converts the name to all lowercase with capitalized
    first word. Returns the name"""

    # if the quantity doesn't start at beginning of string, the beginning must be the name
    if num_start != 0:
        name = ingredient[:num_start]
    # otherwise the name is after the unit til the end of the string
    else:
        name = ingredient[unit_end:]

        # some strings have more parts of the unit/quantity in parentheses. Eliminate these and start name after
        if name[0] == '(':
            name = re.sub(r'\(.*\)\s*', '', name, 1)

    # convert name to all lowercase except first word
    return name[0].upper() + name[1:].lower()


def list_ingredients(ingredients):
    """Takes an ingredients string and converts it into a list of ingredient objects. The objects each have a name,
    optional quantity, and optional unit. Returns the list of ingredients objects
    Calls: get_quantity, get_unit, get_name"""

    ingredients = ingredients.split('\n')

    # remove any bullet points
    for idx in range(len(ingredients)):
        string = ingredients[idx]
        if len(string) > 0 and string[0] == '•':
            string = string[1:]
            ingredients[idx] = string

    # remove leading and trailing spaces
    for idx in range(len(ingredients)):
        string = ingredients[idx]
        while len(string) > 0 and string[0] == ' ':
            string = string[1:]
        while len(string) > 0 and string[-1] == ' ':
            string = string[:-1]
        ingredients[idx] = string

    # remove any empty ingredients
    while "" in ingredients:
        ingredients.remove("")

    # define the Ingredient object class
    class Ingredient:
        def __init__(self, name, quantity=None, unit=None):
            self.name = name
            self.quantity = quantity
            self.unit = unit

        def to_dict(self):
            """Converts the Ingredient instance into a dict that can be converted to JSON"""
            return {
                'name': self.name,
                'quantity': self.quantity,
                'unit': self.unit
            }

    final_ingredients = []

    # iterate over each ingredient to find name, quantity, and unit
    for ingredient in ingredients:

        # remove any parentheses around the ingredient
        if ingredient[0] == '(' and ingredient[len(ingredient)-1] == ')':
            ingredient = ingredient[1:len(ingredient)-1]

        # retrieve the quantity, and the start/end of the quantity section
        quantity, num_start, num_end = get_quantity(ingredient)

        if quantity is not None:
            # retrieve the unit and the end of the unit section (index starting after number section)
            unit, unit_end = get_unit(ingredient, num_end)

            offset = num_end - num_start
            # retrieve the name
            name = get_name(ingredient, num_start, unit_end + offset)

            # create an Ingredient object instance
            ingredient = Ingredient(name, quantity, unit)

        else:
            # if no quantity (and therefore no unit), set name = ingredient (without any special chars)
            name_match = re.search(r'[A-Za-z\d]', ingredient)
            if name_match is not None:
                name = ingredient[name_match.start():]

                # convert name to all lowercase except first word
                name = name[0].upper() + name[1:].lower()

                # create ingredient with just the name
                ingredient = Ingredient(name)
            else:
                ingredient = None

        # add created Ingredient object into list of results
        if ingredient is not None:
            final_ingredients.append(ingredient)

    return final_ingredients


def list_instructions(instructions):
    """Takes an instructions string and converts it into a list of instructions. Removes any bullet points or leading
    numbers. Returns the list of instructions"""

    # separate the instructions by numbered lines, bullets, and the end of sentences

    # check for new line followed by number, followed optionally by a dot and/or a space. Also check for bullets
    instructions = re.sub(r"\n\d+\.?\s*|\n•\s*", '\n', instructions)

    # ends determined by period space or period new line. Does not catch decimals in numbers
    instructions = re.split(r"\.\s+|\.\n|:\n", instructions)

    # if there are no periods, separate by new lines
    if len(instructions) == 1:
        instructions = instructions[0].split('\n')

    # for instructions that span multiple lines, replace new line with space
    else:
        for idx in range(len(instructions)):
            string = instructions[idx]
            string = string.replace('\n', ' ')
            instructions[idx] = string

    # remove any leading and trailing spaces
    for idx in range(len(instructions)):
        string = instructions[idx]
        while len(string) > 0 and string[0] == ' ':
            string = string[1:]
        while len(string) > 0 and string[-1] == ' ':
            string = string[:-1]
        instructions[idx] = string

    # remove any empty instructions
    while "" in instructions:
        instructions.remove("")

    return instructions


def print_results(title, ingredients, instructions):
    """Print the recipe with title, ingredients, and instructions. Prints each ingredient and instruction on its
    own line"""

    # print title
    print(title, '\n')

    # print ingredients
    if len(ingredients) != 0:
        print('Ingredients:')
        for ingredient in ingredients:
            if ingredient.quantity is not None:
                if ingredient.unit is not None:
                    print(str(ingredient.quantity) + ingredient.unit + ' ' + ingredient.name)
                else:
                    print(str(ingredient.quantity) + ' ' + ingredient.name)
            else:
                print(ingredient.name)

    # print instructions
    if len(instructions) != 0:
        print('\nInstructions:')
        for instruction in instructions:
            print(instruction)


def parse_recipe(pdf_data):
    """Takes a file name and parses a recipe from the corresponding pdf file. Creates a recipe with a title,
    ingredients, and instructions"""

    # retrieve the file text and recipe title
    title, text = read_text(pdf_data)
    if text == '':
        print("Couldn't read this pdf")
        return

    # determine the start and end indices of the ingredient and instruction sections
    bounds = get_recipe_bounds(text)
    if bounds is None:
        return
    ingredients_start, ingredients_end, instructions_start, instructions_end = bounds

    # get the text corresponding to the ingredient and instruction sections
    ingredients = text[ingredients_start: ingredients_end]
    instructions = text[instructions_start: instructions_end]

    # create a list of ingredients based on the ingredients text. Ingredients are objects with name, quantity, and unit
    if ingredients != '':
        ingredients = list_ingredients(ingredients)
    else:
        ingredients = []

    # create a list of instructions based on the instructions text. Instructions are strings
    if instructions != '':
        instructions = list_instructions(instructions)
    else:
        instructions = []

    # convert each ingredient to a dictionary instead of an Ingredient instance
    ingredients = [ingredient.to_dict() for ingredient in ingredients]

    return {"name": title, "ingredients": ingredients, "directions": instructions}
