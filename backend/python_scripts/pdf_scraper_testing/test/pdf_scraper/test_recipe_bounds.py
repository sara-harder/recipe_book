import unittest
from python_scripts import pdf_scraper


def create_header_obj(idx, text, text_index):
    return ({
        'idx': idx,
        'text': text,
        'text_index': text_index
    })


class TestRecipeBounds(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ingredient_header = create_header_obj(0, 'Ingredients:', 38)
        cls.ingredient_end_header = create_header_obj(1, 'notes: ', 95)
        cls.instruction_header = create_header_obj(2, 'directions', 139)
        cls.instruction_end_header = create_header_obj(3, 'Video', 195)


    def test_large_header_1(self):
        """Test headers from a headers dict (identified because they are larger in font size). Verify the indices
        returned match the indices of the start and end of the ingredients and instructions section"""
        headers = {
                    'ingredient_header': self.ingredient_header,
                    'instruction_header': self.instruction_header,
                    'half': False,
                    'ingredient_end_header': self.ingredient_end_header,
                    'instruction_end_header': self.instruction_end_header
                  }
        text = "Here is a description of the recipe. \n" \
               "Ingredients:\nHere is a list of ingredients in the recipe\n" \
               "notes: \nMake sure to cut the onion properly\n" \
               "directions\nHere is a list of instructions in the recipe\n" \
               "Video\nWatch the video"

        res = pdf_scraper.get_recipe_bounds(headers, text)

        expected = 51, 95, 150, 195

        self.assertEqual(expected, res)
        self.assertEqual("Here is a list of ingredients in the recipe\n", text[res[0]:res[1]])
        self.assertEqual("Here is a list of instructions in the recipe\n", text[res[2]:res[3]])

    def test_large_header_2(self):
        """Test headers from a headers dict, where no instruction header was found. Verify the indices
        returned match the indices of the start and end of the ingredients section, and -1 for instructions"""
        headers = {
                    'ingredient_header': self.ingredient_header,
                    'instruction_header': None,
                    'half': True,
                    'ingredient_end_header': self.ingredient_end_header,
                    'instruction_end_header': None
                  }
        text = ""

        res = pdf_scraper.get_recipe_bounds(headers, text)

        expected = 51, 95, -1, -1

        self.assertEqual(expected, res)

    def test_large_header_3(self):
        """Test headers from a headers dict, where no ingredients header was found. Verify the indices
        returned match the indices of the start and end of the instructions section, and -1 for ingredients"""
        headers = {
                    'ingredient_header': None,
                    'instruction_header': self.instruction_header,
                    'half': True,
                    'ingredient_end_header': None,
                    'instruction_end_header': self.instruction_end_header
                  }
        text = ""

        res = pdf_scraper.get_recipe_bounds(headers, text)

        expected = -1, -1, 150, 195

        self.assertEqual(expected, res)

    def test_text_header_1(self):
        """Test headers retrieved from text when there are no headers identified from size. Verify the indices
        returned match the indices of the start and end of the ingredients and instructions section"""
        headers = None
        text = "\nIngredients\nInstructions\nNotes\n"

        res = pdf_scraper.get_recipe_bounds(headers, text)

        expected = 13, 13, 26, 26

        self.assertEqual(expected, res)

    def test_text_header_2(self):
        """Test headers retrieved from text when there are no headers identified from size. Verify the indices
        returned match the indices of the start and end of the ingredients and instructions section. Instructions is
        last, so should end at -1"""
        headers = None
        text = "Here is a description of the recipe. \n" \
               "Ingredients\nHere is a list of ingredients in the recipe\n" \
               "Instructions\nHere is a list of instructions in the recipe\n"

        res = pdf_scraper.get_recipe_bounds(headers, text)

        expected = 50, 94, 107, -1

        self.assertEqual(expected, res)
        self.assertEqual("Here is a list of ingredients in the recipe\n", text[res[0]:res[1]])
        self.assertEqual("Here is a list of instructions in the recipe", text[res[2]:res[3]])

    def test_fail_get_header_1(self):
        """Test a recipe where the headers in the text are insufficient to locate bounds"""
        headers = None
        text = "\nIngredients\nNotes \n"

        res = pdf_scraper.get_recipe_bounds(headers, text)

        self.assertIsNone(res)

    def test_fail_get_header_2(self):
        """Test an empty recipe text with no headers"""
        headers = None
        text = ""

        res = pdf_scraper.get_recipe_bounds(headers, text)

        self.assertIsNone(res)




if __name__ == '__main__':
    unittest.main()
