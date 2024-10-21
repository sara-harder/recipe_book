import unittest
import get_occurrences


class TestCompare(unittest.TestCase):

    def test_get_headers_pass_1(self):
        """Test only Ingredients, Instructions, Notes without colons or spaces"""
        text = "\nIngredients\nInstructions\nNotes\n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((1, 12), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((13, 25), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((26, 31), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_2(self):
        """Test only Ingredients, Instructions, End with spaces, without colons"""
        text = "\nIngredients \nDirections \nVideo \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((1, 13), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((14, 25), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((26, 32), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_3(self):
        """Test only Ingredients, Instructions, End with colons and spaces"""
        text = "\nIngredients: \nMethod: \nNotes: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((1, 14), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((15, 23), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((24, 31), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_4(self):
        """Test only Ingredients, Instructions, End with colons, without spaces"""
        text = "\nIngredients:\nInstructions:\nNotes:\n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((1, 13), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((14, 27), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((28, 34), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_5(self):
        """Test Ingredients with details in parentheses and no End header"""
        text = "\nIngredients (for 4 people): \nInstructions: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(0, len(res[2]))
        self.assertEqual((1, 29), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((30, 44), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))

    def test_get_headers_pass_6(self):
        """Test Ingredients with details in parentheses, no End header, and text between headers"""
        text = "\nIngredients (for 4 people): \nHere is a list of ingredients in the recipe \nInstructions: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(0, len(res[2]))
        self.assertEqual((1, 29), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((75, 89), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))

    def test_get_headers_pass_7(self):
        """Test Ingredients and Instructions, no End header, and text before and after headers"""
        text = "Here is a description of the recipe. \nIngredients\nHere is a list of ingredients in the recipe\n" \
               "Instructions\nHere is a list of instructions in the recipe\n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(0, len(res[2]))
        self.assertEqual((38, 49), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((94, 106), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))

    def test_get_headers_pass_8(self):
        """Test multiple occurrences of Ingredients, only one of Instructions and End"""
        text = "\nIngredients\nIngredients (for 4 people):  \nInstructions: \nNotes: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((13, 42), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((43, 57), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((58, 65), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_9(self):
        """Test multiple occurrences of Ingredients and Instructions, only one of End"""
        text = "\nDescription of Ingredients\nDescription of Instructions\nIngredients: \nInstructions: \nNotes: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]) == len(res[2]), msg=msg)
        self.assertEqual((56, 69), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((70, 84), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))
        self.assertEqual((85, 92), res[2][0].span(), msg='end_string="{}"'.format(res[2][0].group()))

    def test_get_headers_pass_10(self):
        """Test End header appearing, but not at end"""
        text = "\nNotes\nIngredients\nInstructions\n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, #ingredients={}, #instructions={}, #end={}'.format(text, len(res[0]), len(res[1]), len(res[2]))

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(0, len(res[2]))
        self.assertEqual((7, 18), res[0][0].span(), msg='ingredients_string="{}"'.format(res[0][0].group()))
        self.assertEqual((19, 31), res[1][0].span(), msg='instructions_string="{}"'.format(res[1][0].group()))

    def test_get_headers_fail_1(self):
        """Test only Ingredients and End header, no Instructions"""
        text = "\nIngredients\nNotes \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, no instructions'.format(text)

        self.assertIsNone(res, msg=msg)

    def test_get_headers_fail_2(self):
        """Test only Instructions and End header, no Ingredients"""
        text = "\nInstructions \nVideo\n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, no ingredients'.format(text)

        self.assertIsNone(res, msg=msg)

    def test_get_headers_fail_3(self):
        """Test Instructions coming before Ingredients. Ingredients must come before instructions to pass"""
        text = "\nInstructions: \nIngredients: \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}'.format(text)

        self.assertIsNone(res, msg=msg)

    def test_get_headers_fail_4(self):
        """Test header text not registering as headers because no new lines used"""
        text = "a list of ingredients, a list of instructions, a set of notes \n"
        res = get_occurrences.get_header_occurrences(text)

        msg = 'text={}, no ingredients'.format(text)

        self.assertIsNone(res, msg=msg)


if __name__ == '__main__':
    unittest.main()
