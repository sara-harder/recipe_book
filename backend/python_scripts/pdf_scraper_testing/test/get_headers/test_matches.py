import unittest
from python_scripts import get_headers


class TestFindMatches(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ingredient_pattern = r"ingredient"
        cls.instruction_pattern = r"instruction|direction|method|preparation|steps"

    def test_find_matches_pass_1(self):
        """Search two headers for ingredient regex. Should match first of the two headers"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'text_index': 20},
                   {'text': 'Instructions ', 'text_index': 208}]
        idx = 0

        res = get_headers.find_matches(headers, self.ingredient_pattern)
        msg = 'regex={}, header={}'.format(self.ingredient_pattern, headers[idx])

        self.assertEqual(1, len(res), msg=msg)
        self.assertEqual(idx, res[0]['idx'], msg=msg)
        self.assertEqual(headers[idx]['text'], res[0]['text'], msg=msg)
        self.assertEqual(headers[idx]['text_index'], res[0]['text_index'], msg=msg)

    def test_find_matches_pass_2(self):
        """Search two headers for instruction regex. Should match second of the two headers"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'text_index': 20},
                   {'text': 'Instructions ', 'text_index': 208}]
        idx = 1

        res = get_headers.find_matches(headers, self.instruction_pattern)
        msg = 'regex={}, header={}'.format(self.instruction_pattern, headers[idx])

        self.assertEqual(1, len(res), msg=msg)
        self.assertEqual(idx, res[0]['idx'], msg=msg)
        self.assertEqual(headers[idx]['text'], res[0]['text'], msg=msg)
        self.assertEqual(headers[idx]['text_index'], res[0]['text_index'], msg=msg)

    def test_find_matches_pass_3(self):
        """Search three headers for ingredient regex. Should match first and second of the three headers"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'text_index': 20},
                   {'text': 'Ingredients:', 'text_index': 102},
                   {'text': 'Instructions ', 'text_index': 208}]
        idx = 1

        res = get_headers.find_matches(headers, self.ingredient_pattern)
        msg = 'regex={}, header={}'.format(self.ingredient_pattern, headers[idx])

        self.assertEqual(2, len(res), msg=msg)
        self.assertEqual(idx, res[1]['idx'], msg=msg)
        self.assertEqual(headers[idx]['text'], res[1]['text'], msg=msg)
        self.assertEqual(headers[idx]['text_index'], res[1]['text_index'], msg=msg)

    def test_find_matches_pass_4(self):
        """Search four headers for instruction regex. Should match second and fourth of the four headers"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'text_index': 20},
                   {'text': 'Description of Method', 'text_index': 71},
                   {'text': 'Ingredients:', 'text_index': 102},
                   {'text': 'Instructions ', 'text_index': 208}]
        idx = 3

        res = get_headers.find_matches(headers, self.instruction_pattern)
        msg = 'regex={}, header={}'.format(self.instruction_pattern, headers[idx])

        self.assertEqual(2, len(res), msg=msg)
        self.assertEqual(idx, res[1]['idx'], msg=msg)
        self.assertEqual(headers[idx]['text'], res[1]['text'], msg=msg)
        self.assertEqual(headers[idx]['text_index'], res[1]['text_index'], msg=msg)

    def test_find_matches_fail_1(self):
        """Search two headers for ingredient regex. Should not match any header."""
        headers = [{'text': 'Baked Mac & Cheese ', 'text_index': 0},
                   {'text': 'Instructions ', 'text_index': 208}]

        res = get_headers.find_matches(headers, self.ingredient_pattern)
        msg = 'regex={}, header={}'.format(self.ingredient_pattern, 'no matches')

        self.assertEqual(0, len(res), msg=msg)

    def test_find_matches_fail_2(self):
        """Search empty list of headers."""
        headers = []

        res = get_headers.find_matches(headers, self.ingredient_pattern)
        msg = 'regex={}, header={}'.format(self.ingredient_pattern, 'no matches')

        self.assertEqual(0, len(res), msg=msg)


class TestFindClosestMatch(unittest.TestCase):

    def test_find_closest_ing_pass_1(self):
        """For ingredients, check that with target index after all headers, returns last header"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'idx': 0},
                   {'text': 'Ingredients:', 'idx': 1}]

        res = get_headers.find_closest_match(headers, 2)
        msg = 'target={}, previous idx={}'.format(2, headers[1]['idx'])

        self.assertEqual(headers[1], res, msg=msg)

    def test_find_closest_ing_pass_2(self):
        """For ingredients, check that with target index between two headers, returns first header"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'idx': 0},
                   {'text': 'Ingredients:', 'idx': 2}]

        res = get_headers.find_closest_match(headers, 1)
        msg = 'target={}, previous idx={}'.format(1, headers[0]['idx'])

        self.assertEqual(headers[0], res, msg=msg)

    def test_find_closest_ing_fail_1(self):
        """For ingredients, check that with target index before all headers, returns None"""
        headers = [{'text': 'Ingredients (for 4 people) ', 'idx': 1},
                   {'text': 'Ingredients:', 'idx': 2}]

        res = get_headers.find_closest_match(headers, 0)
        msg = 'target={}, previous idx={}'.format(0, None)

        self.assertIsNone(res, msg=msg)

    def test_find_closest_instr_pass_1(self):
        """For instructions, check that with target index before all headers, returns first header"""
        headers = [{'text': 'Description of Method', 'idx': 1},
                   {'text': 'Instructions ', 'idx': 2}]

        res = get_headers.find_closest_match(headers, 0, -1)
        msg = 'target={}, next idx={}'.format(0, headers[0]['idx'])

        self.assertEqual(headers[0], res, msg=msg)

    def test_find_closest_instr_pass_2(self):
        """For instructions, check that with target index between two headers, returns last header"""
        headers = [{'text': 'Description of Method', 'idx': 0},
                   {'text': 'Instructions ', 'idx': 2}]

        res = get_headers.find_closest_match(headers, 1, -1)
        msg = 'target={}, next idx={}'.format(1, headers[1]['idx'])

        self.assertEqual(headers[1], res, msg=msg)

    def test_find_closest_instr_fail_1(self):
        """For instructions, check that with target index after all headers, returns None"""
        headers = [{'text': 'Description of Method', 'idx': 0},
                   {'text': 'Instructions ', 'idx': 1}]

        res = get_headers.find_closest_match(headers, 2, -1)
        msg = 'target={}, next idx={}'.format(2, None)

        self.assertIsNone(res, msg=msg)


class TestProcessMatches(unittest.TestCase):
    @staticmethod
    def merge_headers(a, b):
        merged_list = a + b
        merged_list.sort(key=lambda item: item['idx'])
        return [header['text'] for header in merged_list]

    def test_ing_1_instr_1_1(self):
        """Check that with one ingredient and one instruction header, returns those headers"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients:', 'text_index': 102}]
        instruction_headers = [{'idx': 1, 'text': 'Instructions ', 'text_index': 208}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_1_instr_1_2(self):
        """Check that with one ingredient and one instruction header, returns those headers
        even if out of order"""
        ingredient_headers = [{'idx': 1, 'text': 'Ingredients:', 'text_index': 208}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions ', 'text_index': 102}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_2_instr_1_1(self):
        """Check that with more than one ingredient and only one instruction header, returns the ingredient
        header closest (before) to the instruction header and the instruction header"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) ', 'text_index': 102},
                              {'idx': 2, 'text': 'Ingredients:', 'text_index': 347}]
        instruction_headers = [{'idx': 1, 'text': 'Instructions ', 'text_index': 208}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_2_instr_1_2(self):
        """Check that with more than one ingredient and only one instruction header, returns the ingredient
        header closest (before) to the instruction header and the instruction header"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) ', 'text_index': 102},
                              {'idx': 1, 'text': 'Ingredients:', 'text_index': 208}]
        instruction_headers = [{'idx': 2, 'text': 'Instructions ', 'text_index': 347}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[1], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_2_instr_1_3(self):
        """Check that with more than one ingredient and only one instruction header, where all ingredients
        come after the instruction header, returns the first ingredient header and the instruction header"""
        ingredient_headers = [{'idx': 1, 'text': 'Ingredients (for 4 people) ', 'text_index': 208},
                              {'idx': 2, 'text': 'Ingredients:', 'text_index': 347}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions ', 'text_index': 102}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_1_instr_2_1(self):
        """Check that with only one ingredient and more than one instruction header, returns the ingredient
        header and the instruction header closest (after) to the instruction header"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) ', 'text_index': 102}]
        instruction_headers = [{'idx': 1, 'text': 'Instructions ', 'text_index': 208},
                               {'idx': 2, 'text': 'Description of Method', 'text_index': 347}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_1_instr_2_2(self):
        """Check that with only one ingredient and more than one instruction header, returns the ingredient
        header and the instruction header closest (after) to the instruction header"""
        ingredient_headers = [{'idx': 1, 'text': 'Ingredients (for 4 people) ', 'text_index': 208}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions ', 'text_index': 102},
                               {'idx': 2, 'text': 'Description of Method', 'text_index': 347}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_1_instr_2_3(self):
        """Check that with only one ingredient and more than one instruction header, where all instructions
        come before the ingredient header, returns the ingredient header and the last instruction header"""
        ingredient_headers = [{'idx': 2, 'text': 'Ingredients (for 4 people) ', 'text_index': 347}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions ', 'text_index': 102},
                               {'idx': 1, 'text': 'Description of Method', 'text_index': 208}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_1(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. All ingredients come before all instructions,
        should return last ingredient and first instruction"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 1, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 2, 'text': 'Instructions '},
                               {'idx': 3, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[1], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_2(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. Alternate between ingredient, then instruction,
        should return the last ingredient and last instruction."""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 2, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 1, 'text': 'Instructions '},
                               {'idx': 3, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[1], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_3(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. Instructions all come between ingredients, should
        return first ingredient and first instruction"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 3, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 1, 'text': 'Instructions '},
                               {'idx': 2, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_4(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. Ingredients all come between instructions, should
        return last ingredient and last instruction"""
        ingredient_headers = [{'idx': 1, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 2, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions '},
                               {'idx': 3, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[1], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_5(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. Alternate between instruction, then ingredient,
        should return the second to last ingredient and last instruction."""
        ingredient_headers = [{'idx': 1, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 3, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions '},
                               {'idx': 2, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_2_instr_2_6(self):
        """Check that with more than one ingredient and more than one instruction header, returns the last
        closest pair of ingredient then instruction headers. All ingredients come after all instructions,
        should return last instruction and first ingredient"""
        ingredient_headers = [{'idx': 2, 'text': 'Ingredients (for 4 people) '},
                              {'idx': 3, 'text': 'Ingredients:'}]
        instruction_headers = [{'idx': 0, 'text': 'Instructions '},
                               {'idx': 1, 'text': 'Description of Method'}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[1], res['instruction_header'], msg=msg)

    def test_ing_0(self):
        """Check that with one instruction but no ingredient header, return only the instruction header"""
        ingredient_headers = []
        instruction_headers = [{'idx': 0, 'text': 'Instructions '}]

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertIsNone(res['ingredient_header'], msg=msg)
        self.assertEqual(instruction_headers[0], res['instruction_header'], msg=msg)

    def test_instr_0(self):
        """Check that with one ingredient but no instruction header, return only the ingredient header"""
        ingredient_headers = [{'idx': 0, 'text': 'Ingredients:'}]
        instruction_headers = []

        res = get_headers.process_matches(ingredient_headers, instruction_headers)
        msg = '#ingredients={}, #instructions={}, headers={}'\
            .format(len(ingredient_headers), len(instruction_headers),
                    self.merge_headers(ingredient_headers, instruction_headers))

        self.assertEqual(ingredient_headers[0], res['ingredient_header'], msg=msg)
        self.assertIsNone(res['instruction_header'], msg=msg)

    def test_no_headers(self):
        """Check that with no instruction or ingredient headers, return None"""
        res = get_headers.process_matches([], [])
        self.assertIsNone(res, msg='no headers given')


if __name__ == '__main__':
    unittest.main()
