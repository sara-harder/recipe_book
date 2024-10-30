import unittest
from python_scripts import get_headers


def create_header_obj(idx, text_list):
    return ({
        'idx': idx,
        'text': text_list[idx]['text'],
        'text_index': 0
    })


class TestFindHeaders(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ingredient_1 = {'text': 'Ingredients', 'text_index': 0}
        cls.ingredient_2 = {'text': 'ingredient soup', 'text_index': 0}
        cls.ingredient_3 = {'text': 'a list of ingredients:', 'text_index': 0}

        cls.instruction_1 = {'text': 'Instruction', 'text_index': 0}
        cls.instruction_2 = {'text': 'directions', 'text_index': 0}
        cls.instruction_3 = {'text': 'method ', 'text_index': 0}
        cls.instruction_4 = {'text': 'Preparation: ', 'text_index': 0}
        cls.instruction_5 = {'text': 'Steps:', 'text_index': 0}

        cls.end_1 = {'text': 'Video', 'text_index': 0}
        cls.end_2 = {'text': 'notes', 'text_index': 0}
        cls.end_3 = {'text': 'videos', 'text_index': 0}
        cls.end_4 = {'text': 'Note:', 'text_index': 0}

        cls.empty_1 = {'text': '', 'text_index': 0}
        cls.empty_2 = {'text': ' ', 'text_index': 0}
        cls.empty_3 = {'text': '  ', 'text_index': 0}


    def test_find_headers_pass_1(self):
        """Test that with 4 separate headers, correctly finds all 4"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': create_header_obj(2, text_by_size[size]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[size]),
            'instruction_end_header': create_header_obj(3, text_by_size[size])
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_fail_1(self):
        """Test that with no headers, empty dict is returned"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: []}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {}

        self.assertDictEqual(res, expected)

    def test_find_headers_fail_2(self):
        """Test that with text but no large font, empty dict is returned"""
        size = 20
        font_sizes = []
        text_by_size = {size: [self.ingredient_2, self.instruction_2, self.end_2]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {}

        self.assertDictEqual(res, expected)

    def test_find_headers_fail_3(self):
        """Test that with headers but no inst/ing, empty dict is returned"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.end_1, self.end_2, self.end_3]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {}

        self.assertDictEqual(res, expected)

    def test_find_headers_pass_2(self):
        """Test that with 2 headers (only inst/ing), correctly finds both, with instr as ing end"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_3, self.instruction_3]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': create_header_obj(1, text_by_size[size]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[size]),
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_pass_3(self):
        """Test that with 2 headers (only inst/ing), correctly finds both, with ing as instr end"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.instruction_4, self.ingredient_1]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(1, text_by_size[size]),
            'instruction_header': create_header_obj(0, text_by_size[size]),
            'half': False,
            'ingredient_end_header': None,
            'instruction_end_header': create_header_obj(1, text_by_size[size])
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_pass_4(self):
        """Test that with 3 separate headers, correctly finds all 3, with no instr end"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_2, self.end_4, self.instruction_5]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': create_header_obj(2, text_by_size[size]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[size]),
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_pass_5(self):
        """Test that with 3 separate headers, correctly finds all 3, with instr as ing end"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_1, self.instruction_1, self.end_1]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': create_header_obj(1, text_by_size[size]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[size]),
            'instruction_end_header': create_header_obj(2, text_by_size[size])
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_pass_6(self):
        """Test that with 3 separate headers, correctly finds 2, with irrelevant first header"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.end_2, self.instruction_2, self.ingredient_2]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(2, text_by_size[size]),
            'instruction_header': create_header_obj(1, text_by_size[size]),
            'half': False,
            'ingredient_end_header': None,
            'instruction_end_header': create_header_obj(2, text_by_size[size])
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_half_1(self):
        """Test that with instructions but no ingredients, returns dict with just instructions"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.end_3, self.instruction_3, self.end_4]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': None,
            'instruction_header': create_header_obj(1, text_by_size[size]),
            'half': True,
            'ingredient_end_header': None,
            'instruction_end_header': create_header_obj(2, text_by_size[size])
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_half_2(self):
        """Test that with ingredients but no instructions, returns dict with just ingredients"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_1, self.ingredient_2, self.end_3]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(1, text_by_size[size]),
            'instruction_header': None,
            'half': True,
            'ingredient_end_header': create_header_obj(2, text_by_size[size]),
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)


    def test_find_headers_multiple_1(self):
        """Test that with multiple sizes, identifies all headers"""
        size_1 = 12
        size_2 = 20
        size_3 = 32
        font_sizes = [size_2, size_3]
        text_by_size = {size_1: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2],
                        size_2: [self.ingredient_2, self.end_2, self.instruction_2, self.end_3],
                        size_3: [self.ingredient_3, self.end_3, self.instruction_3, self.end_4]
                        }

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {}
        for size in font_sizes:
            expected[size] = {
                'ingredient_header': create_header_obj(0, text_by_size[size]),
                'instruction_header': create_header_obj(2, text_by_size[size]),
                'half': False,
                'ingredient_end_header': create_header_obj(1, text_by_size[size]),
                'instruction_end_header': create_header_obj(3, text_by_size[size])
            }

        self.assertDictEqual(res, expected)


    def test_find_headers_multiple_2(self):
        """Test that with multiple sizes, identifies all headers"""
        size_1 = 12
        size_2 = 20
        size_3 = 32
        font_sizes = [size_2, size_3]
        text_by_size = {size_1: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2],
                        size_2: [self.ingredient_2, self.instruction_2, self.end_3],
                        size_3: [self.ingredient_3, self.end_4]
                        }

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {
            font_sizes[0]: {
                'ingredient_header': create_header_obj(0, text_by_size[font_sizes[0]]),
                'instruction_header': create_header_obj(1, text_by_size[font_sizes[0]]),
                'half': False,
                'ingredient_end_header': create_header_obj(1, text_by_size[font_sizes[0]]),
                'instruction_end_header': create_header_obj(2, text_by_size[font_sizes[0]])
            },
            font_sizes[1]: {
                'ingredient_header': create_header_obj(0, text_by_size[font_sizes[1]]),
                'instruction_header': None,
                'half': True,
                'ingredient_end_header': create_header_obj(1, text_by_size[font_sizes[1]]),
                'instruction_end_header': None
            }
        }

        self.assertDictEqual(res, expected)


    def test_find_headers_empty_1(self):
        """Test that empty headers are not registered. Header text is empty"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_1, self.empty_1, self.instruction_3]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'half': False,
            'ingredient_end_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_empty_2(self):
        """Test that empty headers are not registered. Header text is empty"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_2, self.empty_2, self.instruction_4, self.empty_1]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'half': False,
            'ingredient_end_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)

    def test_find_headers_empty_3(self):
        """Test that empty headers are not registered. Header text is empty"""
        size = 20
        font_sizes = [size]
        text_by_size = {size: [self.ingredient_3, self.empty_3, self.instruction_5, self.empty_2]}

        res = get_headers.find_headers(font_sizes, text_by_size)

        expected = {size: {
            'ingredient_header': create_header_obj(0, text_by_size[size]),
            'instruction_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'half': False,
            'ingredient_end_header': {'idx': 1, 'text': text_by_size[size][2]['text'], 'text_index': 0},
            'instruction_end_header': None
        }}

        self.assertDictEqual(res, expected)


class TestGetHeaders(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ingredient_1 = {'text': 'Ingredients', 'text_index': 0}
        cls.ingredient_2 = {'text': 'ingredient soup', 'text_index': 0}
        cls.ingredient_3 = {'text': 'a list of ingredients:', 'text_index': 0}

        cls.instruction_1 = {'text': 'Instruction', 'text_index': 0}
        cls.instruction_2 = {'text': 'directions', 'text_index': 0}
        cls.instruction_3 = {'text': 'method ', 'text_index': 0}
        cls.instruction_4 = {'text': 'Preparation: ', 'text_index': 0}
        cls.instruction_5 = {'text': 'Steps:', 'text_index': 0}

        cls.end_1 = {'text': 'Video', 'text_index': 0}
        cls.end_2 = {'text': 'notes', 'text_index': 0}
        cls.end_3 = {'text': 'videos', 'text_index': 0}
        cls.end_4 = {'text': 'Note:', 'text_index': 0}


    def test_get_headers_fonts_pass_1(self):
        """Check return headers sized 4 when 2 header font sizes found and all headers whole. No flag sizes provided"""
        text_by_size = {12: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        20: [self.ingredient_2, self.end_2, self.instruction_2, self.end_3],
                        32: [self.ingredient_3, self.instruction_3, self.end_4]
                        }
        font_sizes = {12: len(text_by_size[12]), 20: len(text_by_size[20]), 32: len(text_by_size[32])}

        res = get_headers.get_headers(font_sizes, text_by_size, {}, {})

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[32]),
            'instruction_header': create_header_obj(1, text_by_size[32]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[32]),
            'instruction_end_header': create_header_obj(2, text_by_size[32])
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_fonts_pass_2(self):
        """Check return headers sized 1 when 2 header font sizes found and size 4 missing 'instructions'. No larger
        flag sizes (should be ignored anyway)"""
        text_by_size = {12: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        20: [self.ingredient_2, self.instruction_2, self.end_3],
                        32: [self.ingredient_3, self.end_4]
                        }
        font_sizes = {12: len(text_by_size[12]), 20: len(text_by_size[20]), 32: len(text_by_size[32])}

        res = get_headers.get_headers(font_sizes, text_by_size, {4: len(text_by_size[12])}, {4: text_by_size[12]})

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[20]),
            'instruction_header': create_header_obj(1, text_by_size[20]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[20]),
            'instruction_end_header': create_header_obj(2, text_by_size[20])
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_fonts_pass_3(self):
        """Check return headers sized 4 when 2 header font sizes found and both headers half. No matches in largest
        flag sizes (should be ignored anyway)"""
        text_by_size = {12: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        20: [self.instruction_2, self.end_3],
                        32: [self.ingredient_3, self.end_4]
                        }
        font_sizes = {12: len(text_by_size[12]), 20: len(text_by_size[20]), 32: len(text_by_size[32])}

        res = get_headers.get_headers(font_sizes, text_by_size, {1: len(text_by_size[12]), 4: 1}, {4: [self.end_1]})

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[32]),
            'instruction_header': None,
            'half': True,
            'ingredient_end_header': create_header_obj(1, text_by_size[32]),
            'instruction_end_header': None
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_flags_pass_1(self):
        """Check return headers sized 4 when 2 header flag sizes found and all headers whole. No font sizes provided"""
        text_by_size = {0: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        1: [self.ingredient_2, self.end_2, self.instruction_2, self.end_3],
                        4: [self.ingredient_3, self.instruction_3, self.end_4]
                        }
        flag_sizes = {0: len(text_by_size[0]), 1: len(text_by_size[1]), 4: len(text_by_size[4])}

        res = get_headers.get_headers({}, {}, flag_sizes, text_by_size)

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[4]),
            'instruction_header': create_header_obj(1, text_by_size[4]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[4]),
            'instruction_end_header': create_header_obj(2, text_by_size[4])
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_flags_pass_2(self):
        """Check return headers sized 1 when 2 header flag sizes found and size 4 missing 'instructions'. No larger
        font sizes (only base size)"""
        text_by_size = {0: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        1: [self.ingredient_2, self.instruction_2, self.end_3],
                        4: [self.ingredient_3, self.end_4]
                        }
        flag_sizes = {0: len(text_by_size[0]), 1: len(text_by_size[1]), 4: len(text_by_size[4])}

        res = get_headers.get_headers({12: len(text_by_size[0])}, {12: text_by_size[0]}, flag_sizes, text_by_size)

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[1]),
            'instruction_header': create_header_obj(1, text_by_size[1]),
            'half': False,
            'ingredient_end_header': create_header_obj(1, text_by_size[1]),
            'instruction_end_header': create_header_obj(2, text_by_size[1])
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_flags_pass_3(self):
        """Check return headers sized 4 when 2 header flag sizes found and both headers half. No matches in largest
        font sizes"""
        text_by_size = {0: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        1: [self.instruction_2, self.end_3],
                        4: [self.ingredient_3, self.end_4]
                        }
        flag_sizes = {0: len(text_by_size[0]), 1: len(text_by_size[1]), 4: len(text_by_size[4])}

        res = get_headers.get_headers({12: len(text_by_size[0]), 20: 1}, {20: [self.end_1]}, flag_sizes, text_by_size)

        expected = {
            'ingredient_header': create_header_obj(0, text_by_size[4]),
            'instruction_header': None,
            'half': True,
            'ingredient_end_header': create_header_obj(1, text_by_size[4]),
            'instruction_end_header': None
        }

        self.assertDictEqual(res, expected)


    def test_get_headers_fail_1(self):
        """Check return None when no font sizes or flag sizes provided"""
        res = get_headers.get_headers({}, {}, {}, {})

        self.assertIsNone(res)


    def test_get_headers_fail_2(self):
        """Check return None when no matches in largest font sizes and no larger flag sizes (only base size)"""
        text_by_size = {4: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        20: [self.end_1]
                        }

        res = get_headers.get_headers({4: len(text_by_size[4]), 20: len(text_by_size[20])}, text_by_size,
                                      {4: len(text_by_size[4])}, {4: text_by_size[4]})

        self.assertIsNone(res)


    def test_get_headers_fail_3(self):
        """Check return None when no larger font sizes (only base size) and no matches in largest flag sizes"""
        text_by_size = {4: [self.ingredient_1, self.end_1, self.instruction_1, self.end_2, self.end_3],
                        20: [self.end_1]
                        }

        res = get_headers.get_headers({4: len(text_by_size[4])}, {4: text_by_size[4]},
                                      {4: len(text_by_size[4]), 20: len(text_by_size[20])}, text_by_size)

        self.assertIsNone(res)


if __name__ == '__main__':
    unittest.main()
