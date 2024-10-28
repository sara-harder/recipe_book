import unittest
import pdf_scraper


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
        """Test a basic string of instructions"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_1(self):
        """Test a string of instructions prefixed by numbers with periods"""
        instructions = "1. Here are some instructions. Follow the instructions carefully.\n 2. Not following the " \
                       "instructions could lead to \nundesired consequences. \n3. Always read the instructions before" \
                       " you start cooking.\n4.Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_2(self):
        """Test a string of instructions prefixed by numbers without periods"""
        instructions = "1 Here are some instructions. Follow the instructions carefully.\n 2 Not following the " \
                       "instructions could lead to \nundesired consequences. \n3 Always read the instructions before" \
                       " you start cooking.\n4Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_3(self):
        """Test a string of instructions prefixed by numbers without periods"""
        instructions = "1 Here are some instructions. Follow the instructions carefully.\n 2 Not following the " \
                       "instructions could lead to \nundesired consequences. \n3 Always read the instructions before" \
                       " you start cooking.\n4Now boil \n60 ml of water"

        res = pdf_scraper.list_instructions(instructions)
        expected = list(self.expected)
        expected[4] = "Now boil 60 ml of water"

        self.assertListEqual(expected, res)

    def test_instructions_prefix_4(self):
        """Test a string of instructions prefixed by numbers without periods"""
        instructions = "1 Here are some instructions. Follow the instructions carefully.\n 2 Not following the " \
                       "instructions could lead to \nundesired consequences. \n3 Always read the instructions before" \
                       " you start cooking.\n4Now boil \n50 ml of water"

        res = pdf_scraper.list_instructions(instructions)
        expected = list(self.expected)
        expected[4] = "Now boil 50 ml of water"

        self.assertListEqual(expected, res)

    def test_instructions_prefix_5(self):
        """Test a string of instructions prefixed by numbers without periods"""
        instructions = "1 Here are some instructions. Follow the instructions carefully.\n 2 Not following the " \
                       "instructions could lead to \n 100 undesired consequences. \n3 Always read the instructions " \
                       "before you start cooking.\n4Now boil \n50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)
        expected = list(self.expected)
        expected[2] = "Not following the instructions could lead to 100 undesired consequences"

        self.assertListEqual(expected, res)

    def test_instructions_prefix_6(self):
        """Test a string of instructions that are not prefixed, but have a 1 in a new line position"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\nNow cook \n1 medium sized chicken"

        res = pdf_scraper.list_instructions(instructions)
        expected = list(self.expected)
        expected[4] = "Now cook 1 medium sized chicken"

        self.assertListEqual(expected, res)

    def test_instructions_prefix_7(self):
        """Test a string of instructions prefixed by bullets"""
        instructions = "• Here are some instructions. Follow the instructions carefully.\n • Not following the " \
                       "instructions could lead to \nundesired consequences. \n• Always read the instructions before" \
                       " you start cooking.\n•Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_8(self):
        """Test a string of instructions prefixed by hyphens"""
        instructions = "- Here are some instructions. Follow the instructions carefully.\n - Not following the " \
                       "instructions could lead to \nundesired consequences. \n- Always read the instructions before" \
                       " you start cooking.\n-Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_9(self):
        """Test a string of instructions prefixed by en dashes"""
        instructions = "\n– Here are some instructions. Follow the instructions carefully.\n – Not following the " \
                       "instructions could lead to \nundesired consequences. \n– Always read the instructions before" \
                       " you start cooking.\n–Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_prefix_10(self):
        """Test a string of instructions prefixed by em dashes"""
        instructions = "\n— Here are some instructions. Follow the instructions carefully.\n — Not following the " \
                       "instructions could lead to \nundesired consequences. \n— Always read the instructions before" \
                       " you start cooking.\n—Now boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_separation_1(self):
        """Test a string of instructions separated by colons"""
        instructions = "Here are some instructions. Follow the instructions carefully:\n Not following the " \
                       "instructions could lead to \nundesired consequences: \nAlways read the instructions before" \
                       " you start cooking.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_instructions_separation_2(self):
        """Test a string of instructions without periods, separated by new lines"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_1(self):
        """Test a string of instructions with empty spaces between new lines, with period separators"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \n \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\n \nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_2(self):
        """Test a string of instructions with empty spaces between new lines, without periods"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\n \nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_3(self):
        """Test a string of instructions with a line containing no letters, with period separators"""
        instructions = "Here are some instructions. Follow the instructions carefully.\n Not following the " \
                       "instructions could lead to \nundesired consequences. \nAlways read the instructions before" \
                       " you start cooking.\n1/2.\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)

    def test_empty_instructions_4(self):
        """Test a string of instructions with a line containing no letters, without periods"""
        instructions = "Here are some instructions\nFollow the instructions carefully\n Not following the " \
                       "instructions could lead to undesired consequences \nAlways read the instructions before" \
                       " you start cooking\n1/2\nNow boil 50.0ml of water"

        res = pdf_scraper.list_instructions(instructions)

        self.assertListEqual(self.expected, res)



if __name__ == '__main__':
    unittest.main()
