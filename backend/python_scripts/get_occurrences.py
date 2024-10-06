# for use only when get_headers fails, because font sizes are the same and no flags used
import re


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


def get_header_occurrences(text):
    """Takes the string of text and evaluates where the ingredients and instructions start and end. Returns the
    corresponding indices
    Calls: find_text_occurrences, compare_occurrences"""

    # retrieve all occurrences of ingredient and instruction headers,
    #   as well as potential headers signalling end of instructions
    ingredient_occurrences = find_text_occurrences(text, r"ingredient\w*( *)?(\((\w| )*\) ?)?:?")
    instruction_occurrences = find_text_occurrences(text, r"instruction\w*\b|direction\w*\b|method\w*\b")
    end_occurrences = find_text_occurrences(text, r"notes\w*\b|serving\w*\b|\bend\w*\b|video\w*\b")

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

    return ingredient_occurrences, instruction_occurrences, end_occurrences

