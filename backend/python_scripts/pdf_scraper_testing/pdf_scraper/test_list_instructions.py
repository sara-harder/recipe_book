import unittest
import pdf_scraper


def create_header_obj(idx, text, text_index):
    return ({
        'idx': idx,
        'text': text,
        'text_index': text_index
    })


class TestListInstructions(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.expected = [
                        "Here are some instructions",
                        "Follow the instructions carefully",
                        "Not following the instructions could lead to undesired consequences",
                        "Always read the instructions before you start cooking",
                        "Now boil 50.0ml of water"
                       ]

    def test_instructions_1(self):
        """"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_1(self):
        """"""
        instructions = "1. Here are some instructions. Follow the instructions carefully.\n 2. Not following the " \
                       "instructions could lead to \nundesired consequences. \n3. Always read the instructions before" \
                       " you start cooking.\n4.Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_2(self):
        """"""
        instructions = "1 Here are some instructions. Follow the instructions carefully.\n 2 Not following the " \
                       "instructions could lead to \nundesired consequences. \n3 Always read the instructions before" \
                       " you start cooking.\n4Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_3(self):
        """"""
        instructions = "• Here are some instructions. Follow the instructions carefully.\n • Not following the " \
                       "instructions could lead to \nundesired consequences. \n• Always read the instructions before" \
                       " you start cooking.\n•Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_4(self):
        """"""
        instructions = "- Here are some instructions. Follow the instructions carefully.\n - Not following the " \
                       "instructions could lead to \nundesired consequences. \n- Always read the instructions before" \
                       " you start cooking.\n-Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_5(self):
        """"""
        instructions = "\n– Here are some instructions. Follow the instructions carefully.\n – Not following the " \
                       "instructions could lead to \nundesired consequences. \n– Always read the instructions before" \
                       " you start cooking.\n–Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_separation_1(self):
        """"""
        instructions = "Here are some instructions. Follow the instructions carefully:\n Not following the " \
                       "instructions could lead to \nundesired consequences: \nAlways read the instructions before" \
                       " you start cooking.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_separation_2(self):
        """"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_1(self):
        """"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \n \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\n \nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_2(self):
        """"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\n \nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_3(self):
        """"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\n1/2.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_4(self):
        """"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\n1/2\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)



if __name__ == '__main__':
    unittest.main()
