import pymupdf
import re
import get_headers
import get_occurrences

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


def eval_web_text(text):
    """Check if the text contains a date, URL, or page number."""
    return bool(re.search(r"\d+/\d+/\d+.*\d+:\d+", text) or
                re.search(r"https://.*", text) or
                re.search(r"(page\s*)?\d+\s*of\s*\d+", text, re.IGNORECASE))


def extract_text_info(doc):
    """Extract font sizes, text, and flags from the document."""
    font_sizes, text_by_size, flag_sizes, text_by_flag = {}, {}, {}, {}
    doc_text = ''
    text_index = 0
    source = ''

    for page in doc:
        sorted_block_text = page.get_text("dict", sort=True)["blocks"]
        sorted_straight_text = page.get_text(sort=True)
        straight_text_idx = 0

        for idx, block in enumerate(sorted_block_text):
            if 'lines' not in block:
                continue

            if idx == 0 or idx == len(sorted_block_text) - 1:
                web_text = any(eval_web_text(line["spans"][0]["text"]) for line in block["lines"][:2])
                if web_text:
                    for line in block["lines"][:2]:
                        straight_text_idx += len(line["spans"][0]["text"]) + 1
                        url = re.search(r"https://.*", line["spans"][0]["text"])
                        if url is not None:
                            source = url.group()
                    continue  # Skip if it's web-related text

            # Process valid text
            for line in block["lines"]:
                for span in line["spans"]:
                    size, text, flags = span["size"], span["text"], span["flags"]

                    word_break = 0
                    if sorted_straight_text[straight_text_idx + len(text)] == ('\n' or ' '):
                        word_break = 1

                    if not str.isspace(text):
                        data = {'text': text, 'text_index': text_index}

                        font_sizes[size] = font_sizes.get(size, 0) + 1
                        text_by_size.setdefault(size, []).append(data)

                        flag_sizes[flags] = flag_sizes.get(flags, 0) + 1
                        text_by_flag.setdefault(flags, []).append(data)

                        doc_text += sorted_straight_text[straight_text_idx: straight_text_idx + len(text) + word_break]
                        text_index += len(text) + word_break

                    straight_text_idx += len(text) + word_break

    return doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag


def read_text(pdf_data):
    """Takes a pdf file and reads it page by page. Removes web-generated page headers and footers for safari, firefox,
    edge, and chrome. Adds each modified page to a long string of text. Identifies the title of the recipe as the very
    first line of the first page. Returns the title and the string of text"""

    doc = pymupdf.open(stream=pdf_data, filetype='pdf')

    text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = extract_text_info(doc)

    if text == '':
        return '', '', None

    title = text_by_size[max(font_sizes)][0]
    headers = get_headers.get_headers(font_sizes, text_by_size, flag_sizes, text_by_flag)

    return title['text'], text, headers, source


def get_recipe_bounds(headers, text):
    if headers is None:
        occurrences = get_occurrences.get_header_occurrences(text)
        if occurrences is None:
            return
        ingredient_occurrences, instruction_occurrences, end_occurrences = occurrences

        # establish variables for lists start and end
        # if there is more than one combination of instruction, ingredient, end headers, use the last found
        ingredients_start = ingredient_occurrences[-1].end()
        instructions_end = end_occurrences[-1].start() if end_occurrences else -1

    else:
        ingredients_header = headers['ingredient_header']
        ingredients_start = ingredients_header['text_index'] + len(ingredients_header['text']) + 1

        ingredients_end_header = headers.get('ingredient_end_header')
        ingredients_end = ingredients_end_header['text_index'] if ingredients_end_header else -1

        instruction_header = headers['instruction_header']
        instructions_start = instruction_header['text_index'] + len(instruction_header['text']) + 1

        instruction_end_header = headers.get('instruction_end_header')
        instructions_end = instruction_end_header['text_index'] if instruction_end_header else -1

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

    # remove leading and trailing spaces and extra chars
    for idx in range(len(ingredients)):
        string = ingredients[idx]
        while len(string) > 0 and string[0] in ' ,.-–•':
            string = string[1:]
        while len(string) > 0 and string[-1] in ' ,.-–•':
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

            # remove leading and trailing spaces and extra chars
            while len(name) > 0 and name[0] in ' ,.-–•':
                name = name[1:]
            while len(name) > 0 and name[-1] in ' ,.-–•':
                name = name[:-1]

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

    # add new line to register all numbered lines
    if instructions[0] != '\n':
        instructions = '\n' + instructions

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

    to_remove = []
    for instruction in instructions:
        char = re.search('[a-zA-Z]', instruction)
        if char is None:
            to_remove.append(instruction)
    for instruction in to_remove:
        instructions.remove(instruction)

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
    title, text, headers, source = read_text(pdf_data)
    if text == '':
        print("Couldn't read this pdf")
        return

    bounds = get_recipe_bounds(headers, text)
    if bounds is not None:
        ingredients_start, ingredients_end, instructions_start, instructions_end = bounds
    else:
        return


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

    testing = True
    if testing:
        # print_results(title, ingredients, instructions)
        return None

    # convert each ingredient to a dictionary instead of an Ingredient instance
    ingredients = [ingredient.to_dict() for ingredient in ingredients]

    return {"name": title, "ingredients": ingredients, "directions": instructions, "source": source}
