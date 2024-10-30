import unittest
from python_scripts import get_occurrences


class TestRegex(unittest.TestCase):
    def test_basic_regex(self):
        """Verifies that function returns one match corresponding to first word.
        Tests that a basic pattern is identified correctly"""
        regex = r"regex\b"
        text = 'regex \ntest'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual((0, 5), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_new_line_regex(self):
        """Verifies that function returns one match corresponding to second word.
        Tests that a basic pattern is identified correctly only if it has a new
        line at the end"""
        regex = r"regex\b"
        text = 'regex  regex \ntest'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual((7, 12), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_no_new_line_regex(self):
        """Verifies that function returns no matches when there is no new line
        in the text"""
        regex = r"regex\b"
        text = 'regex  regex test'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_no_break_regex(self):
        """Verifies that function returns no matches if the pattern does not
        go up to end of word"""
        regex = r"rege"
        text = 'regex  regex \ntest'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))


class TestIngredient(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pattern_1 = r"ingredient\w*( *)?"
        cls.pattern_2 = r"\((\w| )*\) ?"
        cls.pattern_3 = r"ingredient\w*( *)?(\((\w| )*\) ?)?:?( *)?"

    def test_ingredient_pattern_1_pass_1(self):
        """Test regex pattern 1 with singular 'ingredient'."""
        regex = self.pattern_1
        text = 'lots of recipe filler, then ingredient ' \
               '\nHere there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 39), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_pass_2(self):
        """Test regex pattern 1 with plural 'ingredients'."""
        regex = self.pattern_1
        text = 'lots of recipe filler, then ingredients ' \
               '\nHere there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 40), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_pass_3(self):
        """Test regex pattern 1 with various chars after 'ingredient', but no break"""
        regex = self.pattern_1
        text = 'lots of recipe filler, then Ingredientswiehrhpw8r ' \
               '\nHere there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 50), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_pass_4(self):
        """Test regex pattern 1 with new line right before and after 'ingredient'."""
        regex = self.pattern_1
        text = 'lots of recipe filler.\nIngredients' \
               '\nHere there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 34), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_fail_1(self):
        """Test regex pattern 1 with no new line before more text"""
        regex = self.pattern_1
        text = 'lots of recipe filler.\nIngredients: ' \
               'Here there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_fail_2(self):
        """Test regex pattern 1 with no new line and no more text"""
        regex = self.pattern_1
        text = 'lots of recipe filler.\nIngredients: '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_1_fail_3(self):
        """Test regex pattern 1 with incomplete word 'ingredients'."""
        regex = self.pattern_1
        text = 'lots of recipe filler.\nngredients: '\
               '\nHere there would be a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_pass_1(self):
        """Test regex pattern 2 with one word between parentheses, w/ space new line"""
        regex = self.pattern_2
        text = 'some text (parentheses) \n more text'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((10, 24), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_pass_2(self):
        """Test regex pattern 2 with no space after parentheses"""
        regex = self.pattern_2
        text = 'some text (parentheses)\nMore text'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((10, 23), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_pass_3(self):
        """Test regex pattern 2 with multiple words between parentheses"""
        regex = self.pattern_2
        text = 'some text (text in parentheses) \nMore text'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((10, 32), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_pass_4(self):
        """Test regex pattern 2 with words and numbers between parentheses"""
        regex = self.pattern_2
        text = '\nIngredients (for 4 people)  \n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((13, 28), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_fail_1(self):
        """Test regex pattern 2 with no new line after parenthesis before more text"""
        regex = self.pattern_2
        text = '\nIngredients (for 4 people) or more\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_fail_2(self):
        """Test regex pattern 2 with new line between parentheses"""
        regex = self.pattern_2
        text = '\nIngredients (for 4 \n or more people)\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_2_fail_3(self):
        """Test regex pattern 2 with no new line and no more text"""
        regex = self.pattern_2
        text = '\nIngredients (for 4 people)  '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_pass_1(self):
        """Test regex pattern 3 with 'ingredients' and words btwn parentheses"""
        regex = self.pattern_3
        text = 'recipe filler \nIngredients (for 4 people)\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((15, 41), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_pass_2(self):
        """Test regex pattern 3 with 'ingredients', words btwn parentheses, and colon"""
        regex = self.pattern_3
        text = 'recipe filler \nIngredients (for 4 people):\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((15, 42), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_pass_3(self):
        """Test regex pattern 3 with 'ingredients', words btwn parentheses, colon, and space"""
        regex = self.pattern_3
        text = 'recipe filler \nIngredients (for 4 people): \n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((15, 43), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_pass_4(self):
        """Test regex pattern 3 with 'ingredients', no parentheses, and colon"""
        regex = self.pattern_3
        text = 'recipe filler \nIngredients:\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((15, 27), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_pass_5(self):
        """Test regex pattern 3 with just 'ingredients'."""
        regex = self.pattern_3
        text = 'recipe filler \nIngredients\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((15, 26), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_fail_1(self):
        """Test regex pattern 3 with no 'ingredients'."""
        regex = self.pattern_3
        text = 'some text (parentheses) \n more text'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_fail_2(self):
        """Test regex pattern 3 with new line between parentheses"""
        regex = self.pattern_3
        text = '\nIngredients (for 4 \n or more people)\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_ingredient_pattern_3_fail_3(self):
        """Test regex pattern 3 with no new line before more text"""
        regex = self.pattern_3
        text = '\nIngredients (for 4 people) here is a list of ingredients'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))


class TestInstruction(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pattern_1 = r"(instruction|direction|method|preparation|steps)\w*:?( *)?"

    def test_instruction_pass_1(self):
        """Test 'instruction' regex, with two instructions but only first has new line"""
        regex = self.pattern_1
        text = 'a list of ingredients, then instruction ' \
               '\nHere there would be a list of instructions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 40), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_instruction_pass_2(self):
        """Test 'instructions' regex without space after"""
        regex = self.pattern_1
        text = 'a list of ingredients, then instructions' \
               '\nHere there would be a list of instruction '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 40), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_instruction_pass_3(self):
        """Test 'Instructions' regex, with new line before header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nInstructions' \
               '\nHere there would be a list of instructions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_instruction_pass_4(self):
        """Test 'Instructions' regex, with colon and space after header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nInstructions: ' \
               '\nHere there would be a list of instructions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 37), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_instruction_fail_1(self):
        """Test 'instructions' regex with no new line"""
        regex = self.pattern_1
        text = 'make sure you are following the instructions '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_instruction_fail_2(self):
        """Test 'instructions' regex with words before new line"""
        regex = self.pattern_1
        text = 'make sure you are following the instructions correctly\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_pass_1(self):
        """Test 'direction' regex, with two directions but only first has new line"""
        regex = self.pattern_1
        text = 'a list of ingredients, then direction ' \
               '\nHere there would be a list of directions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 38), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_pass_2(self):
        """Test 'directions' regex without space after"""
        regex = self.pattern_1
        text = 'a list of ingredients, then directions' \
               '\nHere there would be a list of direction '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 38), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_pass_3(self):
        """Test 'Directions' regex, with new line before header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nDirections' \
               '\nHere there would be a list of directions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 33), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_pass_4(self):
        """Test 'Directions' regex, with colon and space after header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nDirections: ' \
               '\nHere there would be a list of directions'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_fail_1(self):
        """Test 'directions' regex with no new line"""
        regex = self.pattern_1
        text = 'make sure you are following the directions '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_direction_fail_2(self):
        """Test 'directions' regex with words before new line"""
        regex = self.pattern_1
        text = 'make sure you are following the directions correctly\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_pass_1(self):
        """Test 'method' regex, with two methods but only first has new line"""
        regex = self.pattern_1
        text = 'a list of ingredients, then method ' \
               '\nHere there would be a list of instructions in the method'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_pass_2(self):
        """Test 'methods' regex without space after"""
        regex = self.pattern_1
        text = 'a list of ingredients, then methods' \
               '\nHere there would be a list of instructions in the methods '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((28, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_pass_3(self):
        """Test 'Methods' regex, with new line before header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nMethods' \
               '\nHere there would be a list of instructions in the methods'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 30), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_pass_4(self):
        """Test 'Methods' regex, with colon and space after header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nMethods: ' \
               '\nHere there would be a list of instructions in the methods'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 32), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_fail_1(self):
        """Test 'method' regex with no new line"""
        regex = self.pattern_1
        text = 'make sure you are following the correct method '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_fail_2(self):
        """Test 'method' regex with words before new line"""
        regex = self.pattern_1
        text = 'make sure you are following the correct method for the chicken\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_method_fail_3(self):
        """Test 'Method' regex with numbers before new line"""
        regex = self.pattern_1
        text = 'Method 1\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))


class TestEndHeader(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pattern_1 = r"(notes|video)\w*:?( *)?"

    def test_video_pass_1(self):
        """Test 'video' regex, with two videos but only first has new line"""
        regex = self.pattern_1
        text = 'a list of instructions, then a video ' \
               '\nHere there would be an embedded video on the website'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((31, 37), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_video_pass_2(self):
        """Test 'videos' regex without space after"""
        regex = self.pattern_1
        text = 'a list of instructions, then videos' \
               '\nHere there would be a video '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((29, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_video_pass_3(self):
        """Test 'Video' regex, with new line before header"""
        regex = self.pattern_1
        text = 'a list of instructions.\nVideo' \
               '\nHere there would be a video'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((24, 29), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_video_pass_4(self):
        """Test 'Video' regex, with colon and space after header"""
        regex = self.pattern_1
        text = 'a list of instructions.\nVideo: ' \
               '\nHere there would be a video'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((24, 31), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_video_fail_1(self):
        """Test 'video' regex with no new line"""
        regex = self.pattern_1
        text = 'make sure you are following the along with the video '

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_video_fail_2(self):
        """Test 'video' regex with words before new line"""
        regex = self.pattern_1
        text = 'make sure you are following the video correctly\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_pass_1(self):
        """Test 'notes' regex, with two notes but only first has new line"""
        regex = self.pattern_1
        text = 'a list of instructions, then notes ' \
               '\nHere there would be a list of notes'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((29, 35), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_pass_2(self):
        """Test 'Notes' regex, with new line before header and no space"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nNotes' \
               '\nHere there would be a list of notes'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 28), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_pass_3(self):
        """Test 'Notes' regex, with colon and space after header"""
        regex = self.pattern_1
        text = 'a list of ingredients.\nNotes: ' \
               '\nHere there would be a list of notes'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(1, len(res),
                         msg='regex={}, text={}'.format(regex, text))
        self.assertEqual((23, 30), res[0].span(),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_fail_1(self):
        """Test 'notes' regex with no new line"""
        regex = self.pattern_1
        text = 'make sure you check out any additional notes'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_fail_2(self):
        """Test 'notes' regex with words before new line"""
        regex = self.pattern_1
        text = 'make sure you check out any notes about the instructions\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_fail_3(self):
        """Test 'note' regex, not plural"""
        regex = self.pattern_1
        text = 'a list of instructions, then a single note ' \
               '\nHere the list of instructions would continue'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))

    def test_notes_fail_4(self):
        """Test 'note' regex with digit before new line"""
        regex = self.pattern_1
        text = '\nNote 1:\n'

        res = get_occurrences.find_text_occurrences(text, regex)

        self.assertEqual(0, len(res),
                         msg='regex={}, text={}'.format(regex, text))


if __name__ == '__main__':
    unittest.main()
