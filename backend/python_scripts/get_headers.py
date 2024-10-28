import re


def find_closest_match(source_list, target_idx, factor=1):
    """Takes a filtered list of header objects and a target index. Header objects' idx represents the position of the
    header in the original list of headers. Returns the header object with idx closest to target index (before target
    index if factor = 1, elif factor = -1 closest idx after target index)"""
    valid_matches = [match for match in source_list if (target_idx - match['idx']) * factor >= 0]
    if valid_matches:
        return min(valid_matches, key=lambda match: (target_idx - match['idx']) * factor)


def process_matches(ingredient_matches, instruction_matches):
    """Takes a list of ingredient header objects and a list of instruction header objects. Determines which of the
    header objects should be used to identify ingredients and instructions in a recipe. Returns a dict with the one
    header of each type (the two that are the closest together)"""

    # simple if conditions for when one or both lists only have one match
    # find the closest match of ingredient then instruction headers
    if len(ingredient_matches) == len(instruction_matches) == 1:
        return {'ingredient_header': ingredient_matches[0],
                'instruction_header': instruction_matches[0]}
    if ingredient_matches and len(instruction_matches) == 1:
        closest_ingredient = find_closest_match(ingredient_matches, instruction_matches[0]['idx'])
        if closest_ingredient is None:
            closest_ingredient = ingredient_matches[0]
        return {'ingredient_header': closest_ingredient, 'instruction_header': instruction_matches[0]}
    if len(ingredient_matches) == 1 and instruction_matches:
        closest_instruction = find_closest_match(instruction_matches, ingredient_matches[0]['idx'], -1)
        if closest_instruction is None:
            closest_instruction = instruction_matches[-1]
        return {'ingredient_header': ingredient_matches[0], 'instruction_header': closest_instruction}

    # complex if condition for when both lists are longer than one match
    # finds last pair of adjacent ingredient, instruction headers
    if ingredient_matches and instruction_matches:
        closest_ingredients_instructions = []

        for ingredient in ingredient_matches:
            closest_instruction = find_closest_match(instruction_matches, ingredient['idx'], -1)
            if closest_instruction is not None:
                closest_ingredient = find_closest_match(ingredient_matches, closest_instruction['idx'])
                if closest_ingredient is not None:
                    closest_ingredients_instructions.append((closest_ingredient, closest_instruction))

        if closest_ingredients_instructions:
            # return the last valid pair of ingredient and instruction
            return {
                'ingredient_header': closest_ingredients_instructions[-1][0],
                'instruction_header': closest_ingredients_instructions[-1][1]
            }

        # if no ingredients before instructions, do last instruction and first ingredient
        return {'ingredient_header': ingredient_matches[0], 'instruction_header': instruction_matches[-1]}

    if instruction_matches and not ingredient_matches:
        return {'ingredient_header': None, 'instruction_header': instruction_matches[-1]}
    if ingredient_matches and not instruction_matches:
        return {'ingredient_header': ingredient_matches[-1], 'instruction_header': None}
    return None


def find_matches(headers, keywords):
    """Takes a list of header objects and a regex string of keywords. Header objects have the header's text
    and the index of the header within the entire document's text. Returns a list of headers that contain any of
    the keywords. The returned header objects have an additional attribute idx (position in the original list of
    headers)."""
    return [{'idx': idx, 'text': header['text'], 'text_index': header['text_index']}
            for idx, header in enumerate(headers) if re.search(keywords, header['text'], re.IGNORECASE)]


def find_headers(sizes, text_by_size):
    """Takes a list of the largest font sizes and a dictionary of all text, with the text's font size as the key and a
    list of text objects as the value. The text objects have the attributes text and text_index, the index of the text
    within the entire document's text.

    Retrieves the largest text (headers) from the dictionary based on the provided list and finds occurrences of
    'ingredient' and 'instruction'.

    Returns a new headers dictionary with the headers that indicate the starts and ends of the ingredients and
    instructions sections. The keys of the dict are the font sizes. The values are each a dictionary of headers.
    The attributes of the dictionary are 'ingredient_header', 'ingredient_end_header', 'instruction_header', and
    'instruction_end_header'. The values are header objects, with attributes 'idx', 'text', and 'text_index'.

    Instead of font sizes, sometimes uses flag sizes. Procedure is the same: filters by largest flags."""
    headers_dict = {}

    for size in sizes:
        headers = [header for header in text_by_size[size] if header['text'].strip()]

        ingredient_matches = find_matches(headers, r"ingredient")
        instruction_matches = find_matches(headers, r"instruction|direction|method|preparation|steps")

        result = process_matches(ingredient_matches, instruction_matches)
        if result:
            result['half'] = False
            headers_dict[size] = result

            if result['ingredient_header'] is not None:
                ingredient_end_idx = result['ingredient_header']['idx'] + 1
                if ingredient_end_idx < len(headers):
                    result['ingredient_end_header'] = {
                        'idx': ingredient_end_idx,
                        'text': headers[ingredient_end_idx]['text'],
                        'text_index': headers[ingredient_end_idx]['text_index']
                    }
                else:
                    result['ingredient_end_header'] = None
            else:
                result['ingredient_end_header'] = None
                result['half'] = True

            if result['instruction_header'] is not None:
                instruction_end_idx = result['instruction_header']['idx'] + 1
                if instruction_end_idx < len(headers):
                    result['instruction_end_header'] = {
                        'idx': instruction_end_idx,
                        'text': headers[instruction_end_idx]['text'],
                        'text_index': headers[instruction_end_idx]['text_index']
                    }
                else:
                    result['instruction_end_header'] = None
            else:
                result['instruction_end_header'] = None
                result['half'] = True

    return headers_dict


def get_headers(font_sizes, text_by_size, flag_sizes, text_by_flag):
    """Main function to retrieve ingredient and instruction headers. Takes a dictionary of all font sizes in a doc,
    a dictionary of all text by font size in the doc, and two more dictionaries of the same type for the font flags.

    Identifies the headers in the doc based on the font sizes larger than the most common font size. Searches those
    headers for occurrences of 'ingredients' and 'instructions'. If none found, re-identifies headers based on largest
    flags, then searches again.

    Calls: find_headers

    Returns header dict of largest found ingredients + instructions combination"""

    headers_dict = {}

    if font_sizes:
        # Find headers by font size
        most_common_size = max(font_sizes, key=font_sizes.get)
        header_sizes = [size for size in font_sizes if size > most_common_size]
        headers_dict = find_headers(header_sizes, text_by_size)

    # Fallback: if no headers found by size, try by flags (bold/italic)
    if not headers_dict and flag_sizes:
        most_common_flags = max(flag_sizes, key=flag_sizes.get)
        flag_sizes = [flag for flag in flag_sizes if flag > most_common_flags]
        headers_dict = find_headers(flag_sizes, text_by_flag)

    # If still no headers found, return None
    if not headers_dict:
        return None

    # Return the largest-sized headers with both ing and instr (normally there will only be one group)
    # use the largest whole match if possible (match both ing and instr), otherwise use largest half match
    whole = (key for key in headers_dict.keys() if not headers_dict[key]['half'])
    largest_size = max(whole, default=max(headers_dict.keys()))

    return headers_dict[largest_size]
