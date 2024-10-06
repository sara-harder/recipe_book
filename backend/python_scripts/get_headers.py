import re


def find_closest_match(source_list, target_idx):
    """Find the closest match to the target index in source_list."""
    return min(source_list, key=lambda match: abs(match['idx'] - target_idx))


def find_matches(headers, keywords):
    """Find headers that match the given keywords."""
    return [{'idx': idx, 'header': header['text'], 'text_index': header['text_index']}
            for idx, header in enumerate(headers) if re.search(keywords, header['text'], re.IGNORECASE)]


def process_matches(ingredient_matches, instruction_matches):
    """Process the ingredient and instruction matches to find the closest."""
    if len(ingredient_matches) == len(instruction_matches) == 1:
        return {'ingredient_header': ingredient_matches[0],
                'instruction_header': instruction_matches[0]}
    if ingredient_matches and len(instruction_matches) == 1:
        closest_ingredient = find_closest_match(ingredient_matches, instruction_matches[0]['idx'])
        return {'ingredient_header': closest_ingredient, 'instruction_header': instruction_matches[0]}
    if len(ingredient_matches) == 1 and instruction_matches:
        closest_instruction = find_closest_match(instruction_matches, ingredient_matches[0]['idx'])
        return {'ingredient_header': ingredient_matches[0], 'instruction_header': closest_instruction}
    if ingredient_matches and instruction_matches:
        closest_ingredient = find_closest_match(ingredient_matches, instruction_matches[0]['idx'])
        closest_instruction = find_closest_match(instruction_matches, ingredient_matches[0]['idx'])
        return {'ingredient_header': closest_ingredient, 'instruction_header': closest_instruction}
    return None


def find_headers(sizes, text_by_size):
    """Find and match ingredient and instruction headers by font size."""
    headers_dict = {}

    for size in sizes:
        headers = text_by_size[size]
        ingredient_matches = find_matches(headers, r"ingredient")
        instruction_matches = find_matches(headers, r"instruction|direction|method")

        result = process_matches(ingredient_matches, instruction_matches)
        if result:
            headers_dict[size] = result
            # Add the end header logic
            ingredient_end_idx = result['ingredient_header']['idx'] + 1
            if ingredient_end_idx < len(headers):
                result['ingredient_end_header'] = {
                    'idx': ingredient_end_idx,
                    'header': headers[ingredient_end_idx]['text'],
                    'text_index': headers[ingredient_end_idx]['text_index']
                }
            else:
                result['ingredient_end_header'] = None

            instruction_end_idx = result['instruction_header']['idx'] + 1
            if instruction_end_idx < len(headers):
                result['instruction_end_header'] = {
                    'idx': instruction_end_idx,
                    'header': headers[instruction_end_idx]['text'],
                    'text_index': headers[instruction_end_idx]['text_index']
                }
            else:
                result['instruction_end_header'] = None

    return headers_dict


def get_headers(font_sizes, text_by_size, flag_sizes, text_by_flag):
    """Main function to retrieve ingredient and instruction headers."""

    # Find headers by font size
    most_common_size = max(font_sizes, key=font_sizes.get)
    header_sizes = [size for size in font_sizes if size > most_common_size]
    headers_dict = find_headers(header_sizes, text_by_size)

    # Fallback: if no headers found by size, try by flags (bold/italic)
    if not headers_dict:
        most_common_flags = max(flag_sizes, key=flag_sizes.get)
        flag_sizes = [flag for flag in flag_sizes if flag > most_common_flags]
        headers_dict = find_headers(flag_sizes, text_by_flag)

    # If still no headers found, return None
    if not headers_dict:
        return None

    # Return the largest-sized headers (normally there will only be one group of headers)
    largest_size = max(headers_dict.keys())

    return headers_dict[largest_size]
