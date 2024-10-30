import pymupdf
import re
from python_scripts import get_headers
from python_scripts import get_occurrences

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
    'mg': ['mg', 'milligram', 'milligrams', 'milligram(s)'],
    'g': ['g', 'gram', 'grams', 'gram(s)'],
    'kg': ['kg', 'kilogram', 'kilograms', 'kilogram(s)'],
    'ml': ['ml', 'milliliter', 'milliliters', 'milliliter(s)'],
    'cl': ['cl', 'centiliter', 'centiliters', 'centiliter(s)'],
    'dl': ['dl', 'deciliter', 'deciliters', 'deciliter(s)'],
    'l': ['l', 'liter', 'liters', 'liter(s)'],
    'tsp': ['tsp', 'teaspoon', 'teaspoons', 'teaspoon(s)'],
    'tbsp': ['tbsp', 'tblsp', 'tablespoon', 'tablespoons', 'tablespoon(s)'],
    ' cup(s)': ['cup', 'cups', 'cup(s)'],
    'lb': ['lb', 'lbs', 'pound', 'pounds', 'pound(s)'],
    'oz': ['oz', 'ounce', 'ounces'],
    'fl oz': ['fl oz', 'floz' 'fluid ounce', 'fluid ounces', 'fluid ounce(s)'],
    ' pint(s)': ['pint', 'pints', 'pint(s)'],
    ' quart(s)': ['quart', 'quarts', 'quart(s)'],
    ' gallon(s)': ['gallon', 'gallons', 'gallon(s)'],
    ' small': ['small', 'sm'],
    ' medium': ['medium', 'md', 'med'],
    ' large': ['large', 'lg', 'lrg'],
    ' clove(s)': ['clove', 'cloves', 'clove(s)'],
    ' slice(s)': ['slice', 'slices', 'slice(s)'],
    ' cube(s)': ['cube', 'cubes', 'cube(s)'],
    ' drop(s)': ['drop', 'drops', 'drop(s)']
}


def eval_web_text(text):
    """Check if the text contains a date, URL, or page number."""
    return bool(re.search(r"\d+/\d+/\d+.*\d+:\d+", text) or
                re.search(r"https://.*", text) or
                re.search(r"(?<!/)(page\s*)?\b\d+\s*(of|/)\s*\d+\b(?!/)", text, re.IGNORECASE))


def extract_text_info(doc):
    """Takes a document opened with pymupdf. Reads the document and extracts the text, font sizes, and flags. Analyzes
    the text by blocks, but creates string of extracted text using un-sectioned pdf data. Ignores any blocks that
    contain web-generated headers and footers.
    Returns:
         the string of all extracted text
         the source website (if identified in the header/footer)
         a dictionary of font sizes
                key: font size
                value: num of spans of that size
        a dictionary of text by size
                key: font size
                value: text in the span
        two similar dictionaries for flags, using flag number instead of font size"""
    font_sizes, text_by_size, flag_sizes, text_by_flag = {}, {}, {}, {}
    doc_text = ''
    doc_text_idx = 0
    source = ''

    for page in doc:
        blocks = page.get_text("dict", sort=True)["blocks"]
        print(blocks)
        plain_text = page.get_text(sort=True)
        plain_text_idx = 0

        for idx, block in enumerate(blocks):
            if 'lines' not in block:
                continue

            # skip web-related text in first and last blocks
            if idx == 0 or idx == len(blocks) - 1:
                web_text = any(eval_web_text(line["spans"][0]["text"]) for line in block["lines"][:2])
                if web_text:
                    for line in block["lines"][:2]:
                        plain_text_idx += len(line["spans"][0]["text"]) + 1
                        url = re.search(r"https://.*", line["spans"][0]["text"])
                        if url is not None:
                            source = url.group()
                    continue

            # process valid text
            for line in block["lines"]:
                for span in line["spans"]:
                    size, text, flags = span["size"], span["text"], span["flags"]
                    text_len = len(text)

                    # adjust text length if initial character mismatch caused by word_break
                    if len(text) > 1 and text[0] != plain_text[plain_text_idx]:
                        text_len -= 1

                    # if there is a new line or space after the text that is NOT included in the text, add it
                    word_break = 0
                    text_end_idx = plain_text_idx + text_len
                    if text_end_idx < len(plain_text) and plain_text[text_end_idx] in ' \n':
                        word_break = 1

                    text_len += word_break

                    # skip text if it was already included as a word_break for previous text
                    if text in ' \n' and word_break == 0:
                        text_len = 0

                    # if valid text, add it to doc string and dictionaries
                    if text_len > 0:
                        extracted_text = plain_text[plain_text_idx: plain_text_idx + text_len]

                        if text_len - word_break > 0:
                            data = {'text': extracted_text[:text_len - word_break], 'text_index': doc_text_idx}

                            font_sizes[size] = font_sizes.get(size, 0) + 1
                            text_by_size.setdefault(size, []).append(data)

                            flag_sizes[flags] = flag_sizes.get(flags, 0) + 1
                            text_by_flag.setdefault(flags, []).append(data)

                        doc_text += extracted_text
                        doc_text_idx += text_len

                    plain_text_idx += text_len

    return doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag


def read_text(pdf_data):
    """Takes a pdf file and reads it page by page. Calls extract_text function that:
        Removes web-generated page headers and footers for safari, firefox,edge, and chrome.
        Adds each modified page to a long string of text.
        Identifies any source URL.
    Calls get_headers function that identifies instruction and ingredient headers.
    Identifies the title of the recipe as the very first line of the largest size.

    Returns the title, the string of text, the headers, and the source"""

    doc = pymupdf.open(stream=pdf_data, filetype='pdf')

    text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = extract_text_info(doc)

    if text.strip() == '':
        return '', '', None, ''

    title = text_by_size[max(font_sizes)][0]
    headers = get_headers.get_headers(font_sizes, text_by_size, flag_sizes, text_by_flag)

    return title['text'].strip(), text, headers, source


def get_recipe_bounds(headers, text):
    """Takes a dictionary of headers and a string of all the text in a pdf. If the dictionary is empty, call
    secondary function to determine headers using the provided text.

    Returns None if secondary function also fails. Otherwise, returns the start and end indices of the ingredients
    section as determined by the end of the Ingredients header text and start of the header after it, and the start
    and end indices of the instructions section, determined in the same way."""
    if headers is None:
        occurrences = get_occurrences.get_header_occurrences(text)
        if occurrences is None:
            return
        ingredient_occurrences, instruction_occurrences, end_occurrences = occurrences

        # establish variables for lists start and end
        # if there is more than one combination of instruction, ingredient, end headers, use the last found
        ingredients_start = ingredient_occurrences[-1].end()+1
        ingredients_end = instruction_occurrences[-1].start()
        instructions_start = instruction_occurrences[-1].end()+1
        instructions_end = end_occurrences[-1].start() if end_occurrences else -1

    else:
        ingredients_header = headers['ingredient_header']
        ingredients_start = ingredients_header['text_index'] + len(ingredients_header['text']) + 1\
            if ingredients_header else -1

        ingredients_end_header = headers.get('ingredient_end_header')
        ingredients_end = ingredients_end_header['text_index'] if ingredients_end_header else -1

        instruction_header = headers['instruction_header']
        instructions_start = instruction_header['text_index'] + len(instruction_header['text']) + 1 \
            if instruction_header else -1

        instruction_end_header = headers.get('instruction_end_header')
        instructions_end = instruction_end_header['text_index'] if instruction_end_header else -1

    return ingredients_start, ingredients_end, instructions_start, instructions_end


def search_for_character_fraction(num_start, num_end, text, quantity):
    """Updates the quantity depending on a character-based fraction found in the provided text within the given range.
    If the fraction starts at the beginning, it replaces the quantity; otherwise, it is added to the existing quantity.
    Returns the updated quantity and the end index of the fraction in the text."""
    # search for a character-based fraction in the form of "x/y"
    char_fraction = re.search(r"(\d+)/(\d+)\s*", text)

    if char_fraction:
        # calculate the fraction
        fraction = round(int(char_fraction.group(1)) / int(char_fraction.group(2)), 3)

        # update quantity and num_end depending on where the fraction appears
        if char_fraction.start() == num_start:
            quantity = fraction
            num_end = char_fraction.end()
        elif char_fraction.start() <= num_end:
            quantity += fraction
            num_end = char_fraction.end()

    return quantity, num_end


def get_quantity(ingredient):
    """Given an ingredient string, identifies what part of that string indicates the quantity. Checks for fractions
    and 'or' symbols. Returns the quantity, and the start and end indices of the quantity within the string"""

    # find the ingredient's quantity by checking for digits, optional unicode fraction, and decimal point
    number = re.search(r"(\d*\.)?(\d+\s*)([¾⅔½⅓¼⅙⅛])?\s*|([¾⅔½⅓¼⅙⅛])\s*", ingredient)
    if number is None:
        return None, None, None

    quantity = int(number.group(2)) if number.group(2) else 0

    # if there is a decimal point, combine the parts around it
    if number.group(1):
        quantity = float(number.group(1) + number.group(2))

    # if there is a unicode fraction, convert to a float using unicode_fractions dictionary
    unicode_fraction = number.group(3) or number.group(4)
    if unicode_fraction:
        quantity += unicode_fractions[unicode_fraction]

    # check for character-based fractions to replace or add to the quantity
    quantity, num_end = search_for_character_fraction(number.start(), number.end(), ingredient, quantity)

    # retrieve the text after the quantity
    after_quantity = ingredient[num_end:]

    # search for 'or' symbols followed by more quantity text
    or_symbol = re.search(r"([-–—]|or)\s*(((\d*\.)?\d+\s*[¾⅔½⅓¼⅙⅛]?)|[¾⅔½⅓¼⅙⅛])\s*", after_quantity)
    if or_symbol and or_symbol.start() == 0:
        # push the end index of the quantity text to after the alternate option, without updating quantity itself
        _, new_end = search_for_character_fraction(or_symbol.start(), or_symbol.end(), after_quantity, 0)
        num_end += new_end

    return quantity, number.start(), num_end


def identify_unit(ingredient, unit_start, search_start):
    """Identifies and formats the unit in the ingredient string starting at the given index. Unit start and search
    start differ only when there are multiple words in the unit"""
    unit_end = ingredient.find(' ', search_start)
    if unit_end == -1:
        unit_end = len(ingredient)

    unit = ingredient[unit_start:unit_end]

    # format the unit word to allow it to match with the dictionary
    unit = unit.lower().replace('.', '').replace(',', '')

    return unit, unit_end+1


def get_unit(ingredient, num_end):
    """Given an ingredient string and the end index of the quantity section, identifies what part of that string
    indicates the unit. Returns the unit in a standardized form using the unit dictionary, and the end index of
    the unit within the string"""

    # the unit is one word that comes immediately after quantity
    unit, unit_end = identify_unit(ingredient, num_end, num_end)

    if unit == 'fl' or unit == 'fluid':
        unit, unit_end = identify_unit(ingredient, num_end, unit_end)

    # find the unit within the unit dictionary and replace it with the corresponding standardized unit key
    unit = next((key for key, values in units.items() if unit in values), None)

    if unit is None:
        unit_end = num_end

    return unit, unit_end


def get_name(ingredient, num_start, unit_end):
    """Given an ingredient string, the index of the start of the quantity section, and the index of the end of the unit
    section, identifies what part of that string indicates the name. Converts the name to all lowercase with capitalized
    first word. Returns the name"""

    # name comes before quantity if quantity is not at the beginning, otherwise after the unit
    name = ingredient[:num_start] if num_start != 0 else ingredient[unit_end:]

    # some strings have more parts of the unit/quantity in parentheses. Eliminate these and start name after
    if name.startswith('('):
        name = re.sub(r'\(.*\)\s*', '', name, 1)

    # remove leading and trailing spaces and extra chars
    name = name.strip(' ,.-–—·•')
    if len(name) < 2:
        return None

    # convert name to all lowercase except first word
    name = name.capitalize()

    return name


def list_ingredients(ingredients_string):
    """Takes an ingredients string and converts it into a list of ingredient objects. The objects each have a name,
    optional quantity, and optional unit. Returns the list of ingredients objects
    Calls: get_quantity, get_unit, get_name"""
    # add new line to register all prefixed lines
    if ingredients_string[0] != '\n':
        ingredients_string = '\n' + ingredients_string
    # remove any numbered prefixes (format 4.  or 10. , etc.)
    ingredients_string = re.sub(r"\n\s*\d+\.\s+", '\n', ingredients_string)

    # separate ingredients by new lines, and remove redundant spaces and characters
    ingredients = []
    for ingredient in ingredients_string.split('\n'):
        ingredient = ingredient.strip(' ,.-–—·•')
        if ingredient:
            ingredients.append(ingredient)

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
        if ingredient[0] == '(' and ingredient[-1] == ')':
            ingredient = ingredient[1:-1]

        # retrieve the quantity, and the start/end of the quantity section
        quantity, num_start, num_end = get_quantity(ingredient)
        unit = None

        if quantity is not None:
            # retrieve the unit and the end of the unit section (index starting after number section)
            unit, unit_end = get_unit(ingredient, num_end)

            # retrieve the name
            name = get_name(ingredient, num_start, unit_end)

        else:
            # if no quantity (and therefore no unit), set name = ingredient if it is a valid string
            name = re.search(r'\w\w+', ingredient)
            if name is not None:
                name = ingredient.capitalize()

        if name and name[-1] == ':':
            name = None

        # add created Ingredient object into list of results
        if name:
            final_ingredients.append(Ingredient(name, quantity, unit))

    return final_ingredients


def remove_num_prefixes(instructions):
    number_prefix = re.search(r"\n\s*(1)\.?\s*", instructions)
    if number_prefix is None:
        return instructions

    # check if there aren't really prefixes, just a 1 at the beginning of some line
    number_prefix = re.search(r"\n\s*(2)\.?\s*", instructions[number_prefix.end():])
    if not number_prefix:
        return instructions

    # remove numbered prefixes, only the ones that are in order
    large_list = iter(range(1, 1000))
    next_prefix = next(large_list)
    offset = 0

    while True:
        # search for the next numbered prefix starting from the current offset
        number_prefix = re.search(r"\n\s*(\d+)\.?\s*", instructions[offset:])
        if number_prefix is None:
            break

        # calculate the actual positions within the full instructions string
        start = offset + number_prefix.start()
        end = offset + number_prefix.end()

        # check if the prefix matches the expected number
        if int(number_prefix.group(1)) == next_prefix:
            instructions = instructions[:start] + '\n' + instructions[end:]
            offset = start + 1
            next_prefix = next(large_list)
        else:
            offset = end

    return instructions


def list_instructions(instructions):
    """Takes an instructions string and converts it into a list of instructions. Separates the string by the end of
    sentences, any numbered lines, and bulleted lines.  Returns the list of instructions"""
    # add new line to register all prefixed lines
    if instructions[0] != '\n':
        instructions = '\n' + instructions

    # remove numbered prefixes, only if they are in order
    instructions = remove_num_prefixes(instructions)

    # remove bullet and dash prefixes
    instructions = re.sub(r"\n\s*[·•\-–—]\s*", '\n', instructions)

    # split by sentence ends, periods, or colons followed by newlines. Does not catch decimals in numbers
    instructions = re.split(r"\.\s+|\.\n|:\s*\n", instructions)

    # if there are no periods, separate by new lines
    if len(instructions) == 1:
        instructions = instructions[0].split('\n')

    # for instructions that span multiple lines, replace new line with space
    else:
        instructions = [string.replace('\n', ' ') for string in instructions]

    # remove any leading, trailing, and double spaces
    instructions = [re.sub(r'\s+', ' ', ins).strip() for ins in instructions]

    # remove any instructions that are empty or don't contain letters
    instructions = [ins for ins in instructions if re.search('[a-zA-Z]', ins)]

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
    if not bounds:
        return

    ingredients_start, ingredients_end, instructions_start, instructions_end = bounds

    # get the text corresponding to the ingredient and instruction sections
    ingredients = text[ingredients_start: (ingredients_end if ingredients_end != -1 else None)]
    instructions = text[instructions_start: (instructions_end if instructions_end != -1 else None)]

    # create a list of ingredients based on the ingredients text. Ingredients are objects with name, quantity, and unit
    ingredients = list_ingredients(ingredients) if ingredients else []

    # create a list of instructions based on the instructions text. Instructions are strings
    instructions = list_instructions(instructions) if instructions else []

    # convert each ingredient to a dictionary instead of an Ingredient instance
    ingredients = [ingredient.to_dict() for ingredient in ingredients]

    return {"name": title, "ingredients": ingredients, "directions": instructions, "source": source}
