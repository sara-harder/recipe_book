import unittest
import pdf_scraper
from unittest.mock import patch, MagicMock


class TestEvalWebText(unittest.TestCase):

    def test_date_1(self):
        """Test pass a date"""
        text = "13/10/2024 17:20"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='date={}'.format(text))

    def test_date_2(self):
        """Test pass a date with no day"""
        text = "/10/2024 17:20"
        res = pdf_scraper.eval_web_text(text)

        self.assertFalse(res, msg='date={}'.format(text))

    def test_date_3(self):
        """Test pass a date with no time"""
        text = "13/10/2024"
        res = pdf_scraper.eval_web_text(text)

        self.assertFalse(res, msg='date={}'.format(text))

    def test_date_4(self):
        """Test pass a date with text padding on each side"""
        text = "This recipe was downloaded on: 13/10/2024 at 17:20, in Spain"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='date={}'.format(text))

    def test_web_1(self):
        """Test pass a website"""
        text = "https://www.feastingathome.com/chicken-korma"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_web_2(self):
        """Test pass only https"""
        text = "https://"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_web_3(self):
        """Test pass only https with missing /"""
        text = "https:/"
        res = pdf_scraper.eval_web_text(text)

        self.assertFalse(res, msg='website={}'.format(text))

    def test_web_4(self):
        """Test pass a website with text padding on each side"""
        text = "This recipe was downloaded from https://www.feastingathome.com/chicken-korma on 13/10/2024"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_1(self):
        """Test pass a page number with word 'page' """
        text = "Page 2 of 3"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_2(self):
        """Test pass a page number with word 'page' """
        text = "page 2 of 3"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_3(self):
        """Test pass a page number without word 'page' """
        text = "2 of 3"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_4(self):
        """Test pass a page number with / instead of 'of' """
        text = "2/3"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_5(self):
        """Test pass a page number with / instead of 'of' """
        text = "2/10"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))

    def test_page_num_6(self):
        """Test pass a page number with / instead of 'of' with word 'page' """
        text = "Page 2/3"
        res = pdf_scraper.eval_web_text(text)

        self.assertTrue(res, msg='website={}'.format(text))


def create_mock_page(lines):
    # Create a mock page object
    mock_page = MagicMock()

    # Define the behavior of get_text for the mock page
    mock_page.get_text.side_effect = lambda *args, **kwargs: (
        {"blocks": [{'lines': line} for line in lines]}
        if args == ("dict",) and kwargs.get("sort", False)
        else '\n'.join(
            ['\n'.join(
                [''.join(
                    [span['text'] for span in obj['spans']]
                ) for obj in line]
            ) for line in lines]
        )
    )

    return mock_page


# Function to create a span object
def create_mock_span(text, size=12.0, flags=0):
    return {
        "size": size,
        "text": text,
        "flags": flags
    }


class TestExtractText(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.span_1 = create_mock_span("This is the first span of text.")
        cls.span_2 = create_mock_span("This is the second span of text.")

        cls.span_header_1 = create_mock_span("Recipe title", size=32.0, flags=20)
        cls.span_header_2 = create_mock_span("Header of ingredients", size=20.0, flags=4)
        cls.span_header_3 = create_mock_span("Instructions: ", size=20.0, flags=4)

        cls.span_empty_1 = create_mock_span("")
        cls.span_empty_2 = create_mock_span(" ")

        cls.span_no_space_digits = create_mock_span("30")
        cls.span_leading_space = create_mock_span(" mins")
        cls.span_trailing_space = create_mock_span("15 ")
        cls.span_no_space_chars = create_mock_span("mins")
        cls.span_surrounding_space = create_mock_span(" mins ")

        cls.span_date_time = create_mock_span("9/30/24, 12:32 PM")
        cls.span_url = create_mock_span("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe")
        cls.span_safari_page = create_mock_span("Page 1 of 2")
        cls.span_chrome_edge_page = create_mock_span("1/2")
        cls.span_firefox_page = create_mock_span("1 of 2")


    def test_extract_text_1(self):
        """"""
        line_1 = [{'spans': [self.span_1]}, {'spans': [self.span_2]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_1['text'], 'text_index': 0}, {'text': self.span_2['text'], 'text_index': 32}]


        self.assertEqual(self.span_1['text'] + '\n' + self.span_2['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 2}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 2}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_extract_text_2(self):
        """"""
        line_1 = [{'spans': [self.span_header_1]}]
        line_2 = [{'spans': [self.span_header_2]}, {'spans': [self.span_header_3]}]
        mock_doc = [create_mock_page([line_1, line_2])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_32 = [{'text': self.span_header_1['text'], 'text_index': 0}]
        expected_20 = [{'text': self.span_header_2['text'], 'text_index': 13},
                       {'text': self.span_header_3['text'], 'text_index': 35}]


        self.assertEqual(self.span_header_1['text'] + '\n' + self.span_header_2['text'] +
                         '\n' + self.span_header_3['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({32.0: 1, 20.0: 2}, font_sizes)
        self.assertListEqual(expected_32, text_by_size[32.0])
        self.assertListEqual(expected_20, text_by_size[20.0])

        self.assertDictEqual({20: 1, 4: 2}, flag_sizes)
        self.assertListEqual(expected_32, text_by_flag[20])
        self.assertListEqual(expected_20, text_by_flag[4])

    def test_extract_text_3(self):
        """"""
        line_1 = [{'spans': [self.span_header_1]}, {'spans': [self.span_header_2]}]
        line_2 = [{'spans': [self.span_header_3]}]
        mock_doc = [create_mock_page([line_1, line_2])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_32 = [{'text': self.span_header_1['text'], 'text_index': 0}]
        expected_20 = [{'text': self.span_header_2['text'], 'text_index': 13},
                       {'text': self.span_header_3['text'], 'text_index': 35}]


        self.assertEqual(self.span_header_1['text'] + '\n' + self.span_header_2['text'] +
                         '\n' + self.span_header_3['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({32.0: 1, 20.0: 2}, font_sizes)
        self.assertListEqual(expected_32, text_by_size[32.0])
        self.assertListEqual(expected_20, text_by_size[20.0])

        self.assertDictEqual({20: 1, 4: 2}, flag_sizes)
        self.assertDictEqual(text_by_size[32.0][0], text_by_flag[20][0])
        self.assertListEqual(expected_32, text_by_flag[20])
        self.assertListEqual(expected_20, text_by_flag[4])

    def test_fail_extract_text_1(self):
        """"""
        mock_doc = [create_mock_page([])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        self.assertEqual("", doc_text)
        self.assertEqual("", source)
        self.assertDictEqual({}, font_sizes)
        self.assertDictEqual({}, text_by_size)
        self.assertDictEqual({}, flag_sizes)
        self.assertDictEqual({}, text_by_flag)

    def test_fail_extract_text_2(self):
        """"""
        line_1 = [{'spans': [self.span_empty_1]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        self.assertEqual("", doc_text)
        self.assertEqual("", source)
        self.assertDictEqual({}, font_sizes)
        self.assertDictEqual({}, text_by_size)
        self.assertDictEqual({}, flag_sizes)
        self.assertDictEqual({}, text_by_flag)

    def test_fail_extract_text_3(self):
        """"""
        line_1 = [{'spans': [self.span_empty_2]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        self.assertEqual("", doc_text)
        self.assertEqual("", source)
        self.assertDictEqual({}, font_sizes)
        self.assertDictEqual({}, text_by_size)
        self.assertDictEqual({}, flag_sizes)
        self.assertDictEqual({}, text_by_flag)

    def test_extract_text_4(self):
        """"""
        line_1 = [{'spans': [self.span_empty_1]}]
        line_2 = [{'spans': [self.span_empty_2]}, {'spans': [self.span_2]}]
        mock_doc = [create_mock_page([line_1, line_2])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_2['text'], 'text_index': 0}]


        self.assertEqual(self.span_2['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 1}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 1}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_1(self):
        """"""
        line_1 = [{'spans': [self.span_no_space_digits, self.span_leading_space]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_no_space_digits['text'], 'text_index': 0},
                       {'text': self.span_leading_space['text'], 'text_index': 3}]


        self.assertEqual(self.span_no_space_digits['text'] + self.span_leading_space['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 2}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 2}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_2(self):
        """"""
        line_1 = [{'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_trailing_space['text'], 'text_index': 0},
                       {'text': self.span_no_space_chars['text'], 'text_index': 3}]


        self.assertEqual(self.span_trailing_space['text'] + self.span_no_space_chars['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 2}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 2}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_3(self):
        """"""
        line_1 = [{'spans': [self.span_no_space_digits, self.span_leading_space]},
                  {'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_no_space_digits['text'], 'text_index': 0},
                       {'text': self.span_leading_space['text'], 'text_index': 3},
                       {'text': self.span_trailing_space['text'], 'text_index': 8},
                       {'text': self.span_no_space_chars['text'], 'text_index': 11}]


        self.assertEqual(self.span_no_space_digits['text'] + self.span_leading_space['text'] + '\n' +
                         self.span_trailing_space['text'] + self.span_no_space_chars['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 4}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 4}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_4(self):
        """"""
        line_1 = [{'spans': [self.span_no_space_digits, self.span_surrounding_space]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_no_space_digits['text'], 'text_index': 0},
                       {'text': self.span_surrounding_space['text'], 'text_index': 3}]


        self.assertEqual(self.span_no_space_digits['text'] + self.span_surrounding_space['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 2}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 2}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_5(self):
        """"""
        line_1 = [{'spans': [self.span_no_space_digits, self.span_surrounding_space]},
                  {'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_no_space_digits['text'], 'text_index': 0},
                       {'text': self.span_surrounding_space['text'], 'text_index': 3},
                       {'text': self.span_trailing_space['text'], 'text_index': 9},
                       {'text': self.span_no_space_chars['text'], 'text_index': 12}]


        self.assertEqual(self.span_no_space_digits['text'] + self.span_surrounding_space['text'] + '\n' +
                         self.span_trailing_space['text'] + self.span_no_space_chars['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 4}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 4}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_spacing_6(self):
        """"""
        line_1 = [{'spans': [self.span_no_space_digits, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_12 = [{'text': self.span_no_space_digits['text'], 'text_index': 0},
                       {'text': self.span_no_space_chars['text'], 'text_index': 2}]


        self.assertEqual(self.span_no_space_digits['text'] + self.span_no_space_chars['text'], doc_text)
        self.assertEqual("", source)

        self.assertDictEqual({12.0: 2}, font_sizes)
        self.assertListEqual(expected_12, text_by_size[12.0])

        self.assertDictEqual({0: 2}, flag_sizes)
        self.assertListEqual(expected_12, text_by_flag[0])

    def test_web_page_1(self):
        """safari"""
        line_1 = [{'spans': [self.span_header_1]}, {'spans': [self.span_date_time]}]
        line_2 = [{'spans': [self.span_header_2]}, {'spans': [self.span_header_3]}]
        line_3 = [{'spans': [self.span_url]}, {'spans': [self.span_safari_page]}]

        mock_doc = [create_mock_page([line_1, line_2, line_3])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_20 = [{'text': self.span_header_2['text'], 'text_index': 0},
                       {'text': self.span_header_3['text'], 'text_index': 22}]


        self.assertEqual(self.span_header_2['text'] + '\n' + self.span_header_3['text'] + '\n', doc_text)
        self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", source)

        self.assertDictEqual({20.0: 2}, font_sizes)
        self.assertListEqual(expected_20, text_by_size[20.0])

        self.assertDictEqual({4: 2}, flag_sizes)
        self.assertListEqual(expected_20, text_by_flag[4])

    def test_web_page_2(self):
        """chrome / edge"""
        line_1 = [{'spans': [self.span_date_time]}, {'spans': [self.span_header_1]}]
        line_2 = [{'spans': [self.span_header_2]}, {'spans': [self.span_header_3]}]
        line_3 = [{'spans': [self.span_url]}, {'spans': [self.span_chrome_edge_page]}]

        mock_doc = [create_mock_page([line_1, line_2, line_3])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_20 = [{'text': self.span_header_2['text'], 'text_index': 0},
                       {'text': self.span_header_3['text'], 'text_index': 22}]


        self.assertEqual(self.span_header_2['text'] + '\n' + self.span_header_3['text'] + '\n', doc_text)
        self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", source)

        self.assertDictEqual({20.0: 2}, font_sizes)
        self.assertListEqual(expected_20, text_by_size[20.0])

        self.assertDictEqual({4: 2}, flag_sizes)
        self.assertListEqual(expected_20, text_by_flag[4])

    def test_web_page_3(self):
        """firefox"""
        line_1 = [{'spans': [self.span_header_1]}, {'spans': [self.span_url]}]
        line_2 = [{'spans': [self.span_header_2]}, {'spans': [self.span_header_3]}]
        line_3 = [{'spans': [self.span_firefox_page]}, {'spans': [self.span_date_time]}]

        mock_doc = [create_mock_page([line_1, line_2, line_3])]

        res = pdf_scraper.extract_text_info(mock_doc)
        doc_text, source, font_sizes, text_by_size, flag_sizes, text_by_flag = res

        expected_20 = [{'text': self.span_header_2['text'], 'text_index': 0},
                       {'text': self.span_header_3['text'], 'text_index': 22}]


        self.assertEqual(self.span_header_2['text'] + '\n' + self.span_header_3['text'] + '\n', doc_text)
        self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", source)

        self.assertDictEqual({20.0: 2}, font_sizes)
        self.assertListEqual(expected_20, text_by_size[20.0])

        self.assertDictEqual({4: 2}, flag_sizes)
        self.assertListEqual(expected_20, text_by_flag[4])


def create_header_obj(idx, span, text_idx):
    return ({
        'idx': idx,
        'text': span['text'],
        'text_index': text_idx
    })


class TestReadText(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mock_object = MagicMock()


        cls.span_1 = create_mock_span("This is the first span of text.")
        cls.span_2 = create_mock_span("This is the second span of text.")

        cls.span_header_1 = create_mock_span("Recipe title", size=32.0, flags=20)
        cls.span_header_2 = create_mock_span("Header of ingredients", size=20.0, flags=4)
        cls.span_header_3 = create_mock_span("Instructions: ", size=20.0, flags=4)

        cls.span_empty_1 = create_mock_span("")
        cls.span_empty_2 = create_mock_span(" ")

        cls.span_no_space_digits = create_mock_span("30")
        cls.span_leading_space = create_mock_span(" mins")
        cls.span_trailing_space = create_mock_span("15 ")
        cls.span_no_space_chars = create_mock_span("mins")
        cls.span_surrounding_space = create_mock_span(" mins ")

        cls.span_date_time = create_mock_span("9/30/24, 12:32 PM")
        cls.span_url = create_mock_span("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe")
        cls.span_safari_page = create_mock_span("Page 1 of 2")
        cls.span_chrome_edge_page = create_mock_span("1/2")
        cls.span_firefox_page = create_mock_span("1 of 2")


    def test_read_text_1(self):
        """"""
        line_1 = [{'spans': [self.span_1]}, {'spans': [self.span_2]}]
        mock_doc = [create_mock_page([line_1])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual(self.span_1['text'], title)
            self.assertEqual(self.span_1['text'] + '\n' + self.span_2['text'], text)
            self.assertIsNone(headers)
            self.assertEqual("", source)


    def test_read_text_2(self):
        """"""
        line_1 = [{'spans': [self.span_header_1]}]
        line_2 = [{'spans': [self.span_header_2]}, {'spans': [self.span_header_3]}]
        line_3 = [{'spans': [self.span_no_space_digits, self.span_leading_space]},
                  {'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1, line_2, line_3])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, full_text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual(self.span_header_1['text'], title)
            self.assertEqual(self.span_header_1['text'] + '\n' +
                             self.span_header_2['text'] + '\n' + self.span_header_3['text'] + '\n' +
                             self.span_no_space_digits['text'] + self.span_leading_space['text'] + '\n' +
                             self.span_trailing_space['text'] + self.span_no_space_chars['text'], full_text)
            self.assertDictEqual({
                                    'ingredient_header': create_header_obj(0, self.span_header_2, 13),
                                    'instruction_header': create_header_obj(1, self.span_header_3, 35),
                                    'half': False,
                                    'ingredient_end_header': create_header_obj(1, self.span_header_3, 35),
                                    'instruction_end_header': None
                                }, headers)
            self.assertEqual("", source)


    def test_read_text_3(self):
        """"""
        line_1 = [{'spans': [self.span_header_1]}, {'spans': [self.span_header_2]}]
        line_2 = [{'spans': [self.span_no_space_digits, self.span_leading_space]},
                  {'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        mock_doc = [create_mock_page([line_1, line_2])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, full_text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual(self.span_header_1['text'], title)
            self.assertEqual(self.span_header_1['text'] + '\n' + self.span_header_2['text'] + '\n' +
                             self.span_no_space_digits['text'] + self.span_leading_space['text'] + '\n' +
                             self.span_trailing_space['text'] + self.span_no_space_chars['text'], full_text)
            self.assertDictEqual({
                                    'ingredient_header': create_header_obj(0, self.span_header_2, 13),
                                    'instruction_header': None,
                                    'half': True,
                                    'ingredient_end_header': None,
                                    'instruction_end_header': None
                                }, headers)
            self.assertEqual("", source)


    def test_read_text_fail_1(self):
        """"""
        mock_doc = [create_mock_page([])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, full_text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual('', title)
            self.assertEqual('', full_text)
            self.assertIsNone(headers)
            self.assertEqual('', source)


    def test_read_text_fail_2(self):
        """"""
        line_1 = [{'spans': [self.span_empty_1]}]
        line_2 = [{'spans': [self.span_empty_2]}]
        mock_doc = [create_mock_page([line_1, line_2])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, full_text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual('', title)
            self.assertEqual('', full_text)
            self.assertIsNone(headers)
            self.assertEqual('', source)


    def test_read_text_4(self):
        """"""
        line_1 = [{'spans': [self.span_date_time]}, {'spans': [self.span_header_1]}]
        line_2 = [{'spans': [self.span_header_1]}]
        line_3 = [{'spans': [self.span_header_2]}]
        line_4 = [{'spans': [self.span_no_space_digits, self.span_leading_space]},
                  {'spans': [self.span_trailing_space, self.span_no_space_chars]}]
        line_5 = [{'spans': [self.span_header_3]}]
        line_6 = [{'spans': [self.span_1]}, {'spans': [self.span_2]}]
        line_7 = [{'spans': [self.span_url]}, {'spans': [self.span_chrome_edge_page]}]
        mock_doc = [create_mock_page([line_1, line_2, line_3, line_4, line_5, line_6, line_7])]

        with patch('pymupdf.open', return_value=mock_doc):
            title, full_text, headers, source = pdf_scraper.read_text(self.mock_object)

            self.assertEqual(self.span_header_1['text'], title)
            self.assertEqual(self.span_header_1['text'] + '\n' +
                             self.span_header_2['text'] + '\n' +
                             self.span_no_space_digits['text'] + self.span_leading_space['text'] + '\n' +
                             self.span_trailing_space['text'] + self.span_no_space_chars['text'] + '\n' +
                             self.span_header_3['text'] + '\n' +
                             self.span_1['text'] + '\n' + self.span_2['text'] + '\n', full_text)
            self.assertDictEqual({
                                    'ingredient_header': create_header_obj(0, self.span_header_2, 13),
                                    'instruction_header': create_header_obj(1, self.span_header_3, 51),
                                    'half': False,
                                    'ingredient_end_header': create_header_obj(1, self.span_header_3, 51),
                                    'instruction_end_header': None
                                }, headers)
            self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", source)




if __name__ == '__main__':
    unittest.main()
