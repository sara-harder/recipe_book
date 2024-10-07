import unittest
import re
import get_occurrences


class TestCompare(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        texts = [
            "a list of ingredients, a list of instructions, a set of notes",
            "a list of ingredients, a set of notes",
            "ingredients, a list of ingredients, instructions, a list of instructions, notes",
            "ingredients, a list of ingredients, instructions, a list of instructions, some notes,"
            " a reference to ingredients, a reference to instructions, final notes",
            "ingredients, a list of ingredients, instructions, a reference to ingredients in some notes"
            " within a list of instructions, final notes",
            "instructions, ingredients, a list of ingredients with some notes, instructions, a list of instructions, "
            "some notes, the rest of the instructions, a random ingredients"
        ]
        strings = ["ingredients", "instructions", "notes"]

        occurrence_dict = {}
        for idx, text in enumerate(texts):
            occurrence_dict[idx] = {}
            for string in strings:
                occurrence_dict[idx][string] = list(re.finditer(string, text, re.IGNORECASE))

        cls.occurrence_dict = occurrence_dict
        cls.string_1, cls.string_2, cls.string_3 = strings

    def get_func_results(self, string_1, string_2, text):
        occurrences_1 = self.occurrence_dict[text][string_1]
        occurrences_2 = self.occurrence_dict[text][string_2]
        res = get_occurrences.compare_occurrences(occurrences_1, occurrences_2)

        msg = 'string_1={}, string_2={}, num_matches_1={}, num_matches_2={}, len_res_1={}, len_res_2={}'\
            .format(string_1, string_2, len(occurrences_1), len(occurrences_2), len(res[0]), len(res[1]))

        return occurrences_1, occurrences_2, res, msg

    def test_compare_occurrences_text_0_1(self):
        """Verify that with these occurrences:
            one ingredients, one instructions
        Returns one match:
            first ingredients and first instructions"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 0
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[0], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_0_2(self):
        """Verify that with these occurrences:
            one instructions, one notes
        Returns one match:
            first instructions and first notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_2, self.string_3, 0
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[0], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_1_1(self):
        """Verify that with these occurrences:
            one ingredients, zero instructions
        Returns zero matches"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 1
        )

        self.assertTrue(0 == len(res[0]) == len(res[1]), msg=msg)

    def test_compare_occurrences_text_1_2(self):
        """Verify that with these occurrences:
            one ingredients, one notes
        Returns one match:
            first ingredients and first notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_3, 1
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[0], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_2_1(self):
        """Verify that with these occurrences:
            two ingredients, two instructions
        Returns one match:
            second ingredients and first instructions"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 2
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_2_2(self):
        """Verify that with these occurrences:
            two instructions, one notes
        Returns one match:
            second instructions and first notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_2, self.string_3, 2
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_3_1(self):
        """Verify that with these occurrences:
            two ingredients, two instructions, one ingredients, one instructions
        Returns two matches:
            second ingredients and first instructions
            third ingredients and third instructions"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 3
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[2], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[2], res[1][1], msg=msg)

    def test_compare_occurrences_text_3_2(self):
        """Verify that with these occurrences:
            two instructions, one notes, one instructions, one notes
        Returns two matches:
            second instructions and first notes
            third instructions and second notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_2, self.string_3, 3
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[2], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][1], msg=msg)

    def test_compare_occurrences_text_3_3(self):
        """Verify that with these occurrences:
            two ingredients, one notes, one ingredients, one notes
        Returns two matches:
            second ingredients and first notes
            third ingredients and second notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_3, 3
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[2], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][1], msg=msg)

    def test_compare_occurrences_text_4_1(self):
        """Verify that with these occurrences:
            two ingredients, one instructions, one ingredients, one instructions
        Returns two matches:
            second ingredients and first instructions
            third ingredients and second instructions"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 4
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[2], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][1], msg=msg)

    def test_compare_occurrences_text_4_2(self):
        """Verify that with these occurrences:
            one instructions, one notes, one instructions, one notes
        Returns two matches:
            first instructions and first notes
            second instructions and second notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_2, self.string_3, 4
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[0], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[1], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][1], msg=msg)

    def test_compare_occurrences_text_4_3(self):
        """Verify that with these occurrences:
            three ingredients, two notes
        Returns one match:
            third ingredients and first notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_3, 4
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[2], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

    def test_compare_occurrences_text_5_1(self):
        """Verify that with these occurrences:
            one instructions, two ingredients, three instructions, one ingredients
        Returns one match:
            second ingredients and second instructions"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_2, 5
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][0], msg=msg)

    def test_compare_occurrences_text_5_2(self):
        """Verify that with these occurrences:
            one instructions, one notes, two instructions, one notes, one instructions
        Returns two matches:
            first instructions and first notes
            third instructions and second notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_2, self.string_3, 5
        )

        self.assertTrue(2 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[0], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)

        self.assertEqual(occurrences_1[2], res[0][1], msg=msg)
        self.assertEqual(occurrences_2[1], res[1][1], msg=msg)

    def test_compare_occurrences_text_5_3(self):
        """Verify that with these occurrences:
            two ingredients, two notes, one ingredients
        Returns one match:
            second ingredients and first notes"""
        occurrences_1, occurrences_2, res, msg = self.get_func_results(
            self.string_1, self.string_3, 5
        )

        self.assertTrue(1 == len(res[0]) == len(res[1]), msg=msg)
        self.assertEqual(occurrences_1[1], res[0][0], msg=msg)
        self.assertEqual(occurrences_2[0], res[1][0], msg=msg)


if __name__ == '__main__':
    unittest.main()
