import unittest
import pdf_scraper
from unittest.mock import patch, MagicMock


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


class TestMockRecipes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mock_object = MagicMock()

        cls.span_title = create_mock_span("Recipe title", size=32.0, flags=20)
        cls.span_ingredients_header = create_mock_span("Ingredients:", size=20.0, flags=4)
        cls.span_instructions_header = create_mock_span("Instructions: ", size=20.0, flags=4)
        cls.span_notes_header = create_mock_span("Notes:", size=20.0, flags=4)
        cls.span_video_header = create_mock_span("Video: ", size=20.0, flags=4)

        cls.span_date_time = create_mock_span("9/30/24, 12:32 PM")
        cls.span_url = create_mock_span("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe")
        cls.span_chrome_edge_page = create_mock_span("1/2")

        cls.span_description_1 = create_mock_span("Here is a description about the recipe. The description is broken")
        cls.span_description_2 = create_mock_span("into two different lines.")

        cls.span_time_header_1 = create_mock_span("Prep Time", size=18.0, flags=1)
        cls.span_time_header_2 = create_mock_span("Cook Time", size=18.0, flags=1)

        cls.span_no_space_digits = create_mock_span("30")
        cls.span_leading_space = create_mock_span(" mins")
        cls.span_trailing_space = create_mock_span("15 ")
        cls.span_no_space_chars = create_mock_span("mins")

        cls.ingredient_1 = create_mock_span("100g butter")
        cls.ingredient_2 = create_mock_span(" Sugar, 3-4 tbsp ")
        cls.ingredient_3 = create_mock_span("5 1/2 cups FLOUR ")
        cls.ingredient_4 = create_mock_span(" 2.5tsp vanilla")
        cls.ingredient_5 = create_mock_span("Eggs, ½")
        cls.ingredient_6 = create_mock_span("4 fl oz water")
        cls.ingredient_7 = create_mock_span("Cinnamon")
        cls.ingredient_8 = create_mock_span("---extra flour for rolling")

        cls.instructions_1 = create_mock_span("Here are some instructions. Follow the instructions carefully.")
        cls.instructions_2 = create_mock_span(" Not following the instructions could lead to ")
        cls.instructions_3 = create_mock_span("undesired consequences. ")
        cls.instructions_4 = create_mock_span("Always read the instructions before you start cooking.")
        cls.instructions_5 = create_mock_span("Now boil 50.0ml of water")

        cls.note_1_header = create_mock_span("NOTE 1:", size=18.0, flags=1)
        cls.note_2_header = create_mock_span("Note 2-", size=18.0, flags=1)

        cls.note_1 = create_mock_span("This is the first note about the instructions")
        cls.note_2 = create_mock_span("This is the second note about the instructions. It has two sentences.")

        cls.video_link = create_mock_span("https://www.youtube.com/watch?v=VZRba-PzsvE")

        cls.span_empty_1 = create_mock_span("")
        cls.span_empty_2 = create_mock_span(" ")

        cls.chrome_edge_header = [{'spans': [cls.span_date_time]}, {'spans': [cls.span_title]}]
        cls.chrome_edge_footer = [{'spans': [cls.span_url]}, {'spans': [cls.span_chrome_edge_page]}]

        cls.title = [{'spans': [cls.span_title]}]
        cls.description = [{'spans': [cls.span_description_1]}, {'spans': [cls.span_description_2]}]
        cls.time_1 = [{'spans': [cls.span_time_header_1]},
                      {'spans': [cls.span_no_space_digits, cls.span_leading_space]}]
        cls.time_2 = [{'spans': [cls.span_time_header_2]},
                      {'spans': [cls.span_trailing_space, cls.span_no_space_chars]}]

        cls.ingredient_header = [{'spans': [cls.span_ingredients_header]}]
        cls.ingredients = [{'spans': [cls.ingredient_1]},
                           {'spans': [cls.ingredient_2]},
                           {'spans': [cls.ingredient_3]},
                           {'spans': [cls.ingredient_4]},
                           {'spans': [cls.span_empty_1]},
                           {'spans': [cls.ingredient_5]},
                           {'spans': [cls.ingredient_6]},
                           {'spans': [cls.ingredient_7]},
                           {'spans': [cls.ingredient_8]}
                           ]

        cls.instruction_header = [{'spans': [cls.span_instructions_header]}]
        cls.instructions = [{'spans': [cls.instructions_1]},
                            {'spans': [cls.instructions_2]},
                            {'spans': [cls.instructions_3]},
                            {'spans': [cls.span_empty_2]},
                            {'spans': [cls.instructions_4]},
                            {'spans': [cls.instructions_5]}
                            ]

        cls.notes_header = [{'spans': [cls.span_notes_header]}]
        cls.notes = [{'spans': [cls.note_1_header, cls.note_1]},
                     {'spans': [cls.note_2_header, cls.note_2]}
                     ]

        cls.video_header = [{'spans': [cls.span_video_header]}]
        cls.video = [{'spans': [cls.video_link]}]

    @staticmethod
    def ingredientDict(name, quantity, unit):
        return {
            'name': name,
            'quantity': quantity,
            'unit': unit
        }

    def test_parse_recipe_1(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.ingredients,
                                      self.notes_header,
                                      self.notes,
                                      self.instruction_header,
                                      self.instructions,
                                      self.video_header,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_2(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.ingredients,
                                      self.instruction_header,
                                      self.instructions,
                                      self.notes_header,
                                      self.notes,
                                      self.video_header,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_3(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.ingredients,
                                      self.instruction_header,
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.instructions,
                                      self.notes_header,
                                      self.notes,
                                      self.video_header,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_4(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.ingredients,
                                      self.instruction_header,
                                      self.instructions[:3],
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.instructions[3:],
                                      self.notes_header,
                                      self.notes,
                                      self.chrome_edge_footer
                                      ])
                    ]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_5(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.ingredients,
                                      self.instruction_header,
                                      self.instructions[:4],
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.instructions[4:],
                                      self.notes_header,
                                      self.notes,
                                      self.chrome_edge_footer
                                      ])
                    ]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_6(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.ingredients[:3],
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.ingredients[3:],
                                      self.instruction_header,
                                      self.instructions[:4],
                                      self.chrome_edge_footer
                                      ]),
                    create_mock_page([self.chrome_edge_header,
                                      self.instructions[4:],
                                      self.notes_header,
                                      self.notes,
                                      self.chrome_edge_footer
                                      ])
                    ]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_7(self):
        """"""
        mock_doc = []

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertIsNone(recipe)

    def test_parse_recipe_8(self):
        """"""
        mock_doc = [create_mock_page([]), create_mock_page([])]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertIsNone(recipe)

    def test_parse_recipe_9(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.ingredients,
                                      self.notes,
                                      self.instructions,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertIsNone(recipe)

    def test_parse_recipe_10(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.ingredients,
                                      self.notes,
                                      self.instructions,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertIsNone(recipe)

    def test_parse_recipe_11(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.ingredient_header,
                                      self.ingredients,
                                      self.notes_header,
                                      self.notes,
                                      self.video_header,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual([], recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_parse_recipe_12(self):
        """"""
        mock_doc = [create_mock_page([self.chrome_edge_header,
                                      self.title,
                                      self.description,
                                      self.time_1,
                                      self.time_2,
                                      self.notes_header,
                                      self.notes,
                                      self.instruction_header,
                                      self.instructions,
                                      self.video_header,
                                      self.video,
                                      self.chrome_edge_footer
                                      ])]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual(self.span_url['text'], recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            self.assertListEqual([], recipe['ingredients'])

    def test_parse_recipe_13(self):
        """"""
        mock_doc = [create_mock_page([self.title,
                                      self.ingredient_header,
                                      self.ingredients,
                                      self.instruction_header,
                                      self.instructions
                                      ])]
        ingredients = [
            self.ingredientDict('Butter', 100, 'g'),
            self.ingredientDict('Sugar', 3, 'tbsp'),
            self.ingredientDict('Flour', 5.5, ' cup(s)'),
            self.ingredientDict('Vanilla', 2.5, 'tsp'),
            self.ingredientDict('Eggs', 0.5, None),
            self.ingredientDict('Water', 4, 'fl oz'),
            self.ingredientDict('Cinnamon', None, None),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]

        instructions = [
            "Here are some instructions",
            "Follow the instructions carefully",
            "Not following the instructions could lead to undesired consequences",
            "Always read the instructions before you start cooking",
            "Now boil 50.0ml of water"
        ]

        with patch('pymupdf.open', return_value=mock_doc):
            recipe = pdf_scraper.parse_recipe(self.mock_object)

            self.assertEqual(self.span_title['text'], recipe['name'])
            self.assertEqual("", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)


class TestRealRecipePDFs(unittest.TestCase):
    @staticmethod
    def ingredientDict(name, quantity, unit):
        return {
            'name': name,
            'quantity': quantity,
            'unit': unit
        }

    @classmethod
    def setUpClass(cls):
        cls.pita_ingredients = [
            cls.ingredientDict('All-purpose flour', 500, 'g'),
            cls.ingredientDict('Instant dry yeast', 9, 'g'),
            cls.ingredientDict('Lukewarm water', 300, 'ml'),
            cls.ingredientDict('Sugar', 1, 'tsp'),
            cls.ingredientDict('Salt', 1, 'tsp'),
            cls.ingredientDict('Sunflower or corn oil + some extra to oil the pan and the pitas', 3, 'tbsp')
        ]
        cls.pita_instructions = [
            "Sift flour in a large bowl",
            "Mix flour with salt and sugar",
            "Dissolve yeast in water",
            "Add the oil and yeast water to the flour",
            "Knead for 6-10 minutes until you have a soft non-sticky dough",
            "See Note 1 below",
            "Oil lightly the bowl and the top of the dough",
            "Place the dough in the bowl",
            "Cover the bowl with a dampened tea towel",
            "Heat the oven to 100°C / 210°F for 2 minutes then turn it off",
            "Rise",
            "Place the bowl in the oven and allow to rise for 1 hour and 30 minutes until almost tripled in size",
            "Alternatively, you can leave it to rise at room temperature",
            "Press the dough to remove the air",
            "Then transfer to a lightly oiled working surface",
            "Knead dough for a minute",
            "Shape into a round ball and then into a cord",
            "Cut the dough in half and then cut each half into 3 pieces of the same size (6 in total)",
            "Shape each piece into a round ball",
            "Make sure you close the bottom of the dough well",
            "Brush lightly each dough ball with oil",
            "Then cover with a tea towel and rest for 10 minutes",
            "Shape into flatbread",
            "Take a dough ball and open it up with your hands into a round 20- cm (8-inch) disk",
            "Heat a non-stick frying pan (or a cast-iron skillet) over high heat",
            "Brush pan with oil",
            "Cook the flatbread for 1 minute then flip and cook for another minute",
            "Then turn the heat to low and cook for 30 more seconds",
            "See Note 2 below",
            "Transfer the flatbread to a clean tea towel to cool",
            "Turn the heat to high again",
            "Prepare the next flatbread",
            "Continue like this until you cook all the Pita",
            "Serve with dips, make wraps, or store it in the freezer for later use",
            "To store in the freezer place in a freezer plastic bag and freeze for up to 6 months"
        ]

    def test_bad_korma(self):
        """This pdf was badly constructed. Even though the website had a print button, it wasn't a formatted pdf,
        just a plain pdf of the website. The columns of ingredients then instructions cause the reader to not parse
        the order correctly. So, the ingredients are blended in with the first 2 steps, and no ingredients are correctly
        identified."""
        instructions = [
            "Step 1 Put 1 chopped onion, 2 onion, chopped garlic cloves, roughly chopped thumb-sized piece ginger, roughly chopped 4 tbsp korma paste roughly chopped garlic cloves and a roughly chopped thumb-sized piece of ginger in a food processor and whizz to a paste",
            "4 skinless, boneless chicken breasts, cut into bite-sized pieces 50g ground almonds, plus extra to serve (optional) 4 tbsp sultanas 400ml chicken stock ¼ tsp golden caster sugar 150g pot 0% fat Greek yogurt small bunch coriander, chopped Step 2 Tip the paste into a large high-sided frying pan with tbsp water and cook for 5 mins",
            "Step 3 Add 4 tbsp korma paste and cook for a further 2 mins until aromatic",
            "Step 4 Stir 4 skinless, boneless chicken breasts, cut into bite-sized pieces, into the sauce",
            "Step 5 Add 50g ground almonds, tbsp sultanas, 400ml chicken stock and ¼ tsp golden caster sugar",
            "Step 6 Give everything a good mix, then cover and simmer for 10 mins or until the chicken is cooked through",
            "Step 7 Remove the pan from the heat, stir in a 150g pot Greek yogurt and some seasoning, then scatter over a small bunch of chopped coriander and more ground almonds, if using",
            "Serve with brown or white basmati rice"
        ]

        with open('test_pdfs/Bad Chicken Korma.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Chicken korma", recipe['name'])
            self.assertEqual("https://www.bbcgoodfood.com/recipes/chicken-korma", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            self.assertListEqual([], recipe['ingredients'])

    def test_good_korma(self):
        """"""
        ingredients = [
            self.ingredientDict('Chicken breasts (or chicken thighs- *see notes)', 1, 'lb'),
            self.ingredientDict('Coconut oil (or avocado oil, or other neutral oil)', 1, 'tbsp'),
            self.ingredientDict('Yellow onion, sliced (see notes)', 1, None),
            self.ingredientDict('Fresh ginger, chopped', 1, 'tbsp'),
            self.ingredientDict('Garlic, chopped', 6, ' clove(s)'),
            self.ingredientDict('Whole cumin seeds', 1, 'tsp'),
            self.ingredientDict('Plain yogurt (full fat was used for this recipe)', 0.5, ' cup(s)'),
            self.ingredientDict('Tomato paste', 1, 'tbsp'),
            self.ingredientDict('Raw cashews (or blanched almonds or coconut cream or coconut', 0.25, ' cup(s)'),
            self.ingredientDict('Milk)', None, None),
            self.ingredientDict('Chicken broth or vegetable broth', 0.5, ' cup(s)'),
            self.ingredientDict('Salt, plus more for seasoning the chicken', 1, 'tsp'),
            self.ingredientDict('Ghee or coconut oil', 1, 'tbsp'),
            self.ingredientDict('Kashmiri chili powder or red chili powder, paprika or 1/4', 1, 'tsp'),
            self.ingredientDict('Teaspoon cayenne pepper', None, None),
            self.ingredientDict('Garam masala curry powder', 1, 'tsp'),
            self.ingredientDict('Ground coriander', 1.5, 'tsp'),
            self.ingredientDict('Ground cumin', 1, 'tsp'),
            self.ingredientDict('Turmeric', 0.5, 'tsp'),
            self.ingredientDict('Ground cardamom', 0.5, 'tsp'),
            self.ingredientDict('Black pepper', 0.25, 'tsp'),
            self.ingredientDict('Ground cinnamon', 0.25, 'tsp'),
            self.ingredientDict('Serrano chilies- see notes', 1, None),
            self.ingredientDict('Serve with fresh spinach and fresh cilantro', None, None),
            self.ingredientDict('Cook mode prevent your screen from going dark', None, None)
        ]
        instructions = [
            "Cut chicken breast into 1-2″ chunks, and season with salt and pepper",
            "Set aside",
            "In a large heavy pan, saute onions in coconut oil for 15 minutes over medium-low heat until softened and starting to brown",
            "Add cumin seeds, ginger, and garlic and saute another 15 minutes or until onions are caramelized, they will be golden brown and melty",
            "Let cool for a few minutes",
            "Put onion mixture in a blender or food processor with yogurt, tomato paste, cashews (or almonds), broth, and salt",
            "Blend until mostly smooth or leave some texture if you prefer that",
            "The consistency will be thick",
            "Set aside the korma sauce",
            "In a small bowl mix together Kashmiri chili powder, garam masala, coriander, cumin, turmeric, black pepper, cardamom and cinnamon",
            "Add ghee and the spices to a pot or large pan",
            "Stir over low heat for about a minute",
            "Turn up to medium heat and add the chicken stirring a minute to coat all the pieces with the spices, add the serrano chilies and the korma sauce",
            "Bring to a simmer for about 8- 10 minutes stirring frequently to keep the sauce from sticking to the pan",
            "If you prefer a thinner sauce add more broth or water (adjust the spices accordingly, adding more salt or garam masala if needed)",
            "Once the chicken is cooked through remove from heat",
            "Garnish with fresh cilantro and serve over fresh spinach leaves with steamed basmati rice and naan"
        ]

        with open('test_pdfs/Good Chicken Korma.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Chicken Korma recipe", recipe['name'])
            self.assertEqual("https://www.feastingathome.com/chicken-korma/print/71780/", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_safari_pita(self):
        """"""
        ingredients = self.pita_ingredients
        instructions = self.pita_instructions

        with open('test_pdfs/Safari Pita.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread Recipe", recipe['name'])
            self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_chrome_pita(self):
        """"""
        ingredients = self.pita_ingredients
        instructions = self.pita_instructions

        with open('test_pdfs/Chrome Pita.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread Recipe", recipe['name'])
            self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_edge_pita(self):
        """"""
        ingredients = self.pita_ingredients
        instructions = list(self.pita_instructions)
        instructions[23] = "Take a dough ball and open it up with your hands into a round 20-cm (8-inch) disk"

        with open('test_pdfs/Edge Pita.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread Recipe", recipe['name'])
            self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_firefox_pita(self):
        """"""
        ingredients = self.pita_ingredients
        instructions = list(self.pita_instructions)
        instructions[23] = "Take a dough ball and open it up with your hands into a round 20-cm (8-inch) disk"

        with open('test_pdfs/Firefox Pita.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread Recipe", recipe['name'])
            self.assertEqual("https://realgreekrecipes.com/wprm_print/greek-pita-bread-recipe", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_direct_web_pita(self):
        """"""
        ingredients = self.pita_ingredients + [self.ingredientDict('Prevent your screen from going dark', None, None),
                                               self.ingredientDict('Cook mode', None, None)]
        instructions = list(self.pita_instructions)
        instructions[23] = "Take a dough ball and open it up with your hands into a round 20-cm (8-inch) disk"

        with open('test_pdfs/Direct From Web Pita.pdf', 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread Recipe", recipe['name'])
            self.assertEqual("https://realgreekrecipes.com/greek-pita-bread-recipe/", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_alternate_pita(self):
        """"""
        ingredients = [
            self.ingredientDict('Lukewarm water', 1.5, ' cup(s)'),
            self.ingredientDict('Active dry yeast', 1.5, 'tsp'),
            self.ingredientDict('Sugar', 1, 'tsp'),
            self.ingredientDict('Olive oil', 2, 'tbsp'),
            self.ingredientDict('Sea salt', 1, 'tsp'),
            self.ingredientDict('All-purpose flour', 3.5, ' cup(s)'),
            self.ingredientDict('Extra flour for rolling', None, None)
        ]
        instructions = [
            "In the bowl of a stand mixer equipped with a hook, add the water, the yeast, and the sugar and mix to combine",
            "Let the mixture stand for five minutes or until you see that the yeast is forming small bubbles",
            "Add the olive oil and the salt",
            "With the motor running, gradually add the flour and mix until the dough pulls away from the sides of the bowl",
            "Cover and leave in a warm spot in your kitchen to rise and rest for about 30 minutes",
            "Divide the dough into eight pieces",
            "Dust each piece with some extra flour and roll it out into 8” rounds that are about ¼” thick",
            "If the dough resists the stretching, let it relax for a few minutes and then try rolling it again",
            "Lightly poke the surface of your pita breads with the tines of a fork, making sure you do not poke right through",
            "Place a heavy cast-iron skillet (or a non-stick pan) over medium-high heat",
            "Grease the hot skillet with some olive oil",
            "Place the pita on the hot skillet and reduce the heat to medium",
            "Cook the pita for a couple of minutes until it starts to puff up and get a nice golden color",
            "Flip and cook the other side",
            "Place the pita breads on a clean cotton kitchen towel and cover with the towel",
            "Continue with the rest of the pitas, greasing the skillet lightly each time as you go",
            "Stack the pitas, tucked inside the kitchen towel",
            "Serve warm or allow to cool inside the kitchen towel"
        ]

        with open("test_pdfs/Marilena's Pita.pdf", 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Pita Bread", recipe['name'])
            self.assertEqual("https://marilenaskitchen.com/easyrecipe-print/3465-0/", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_greek_salad(self):
        """"""
        ingredients = [
            self.ingredientDict('Cherry tomatoes', None, None),
            self.ingredientDict('Feta', None, None),
            self.ingredientDict('Cucumbers', None, None),
            self.ingredientDict('Onion', None, None),
            self.ingredientDict('Tuna', None, None),
            self.ingredientDict('Oregano', None, None),
            self.ingredientDict('Olive oil', None, None),
            self.ingredientDict('Salt', None, None)
        ]

        instructions = [
            "Decide how much of each ingredient to include by eye according to taste",
            "Wash and cut the tomatoes in half or thirds",
            "Season the tomatoes with a drizzle of oil, oregano, and salt",
            "Cut the onion into small pieces",
            "Cut the cucumber into slices and then cut the slices in half",
            "Cut the feta into small cubes",
            "Add the tuna, separated into smaller bits",
            "Combine all the ingredients together",
            "Add the lettuce on individual plates, and serve"
        ]

        with open("test_pdfs/Greek Salad.pdf", 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Greek Salad", recipe['name'])
            self.assertEqual("", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_mac_and_cheese(self):
        """"""
        ingredients = [
            self.ingredientDict('Macaroni', 320, 'g'),
            self.ingredientDict('Butter', 4, 'tbsp'),
            self.ingredientDict('Flour', 2, 'tbsp'),
            self.ingredientDict('Milk', 100, 'ml'),
            self.ingredientDict('Heavy cream', 200, 'ml'),
            self.ingredientDict('Paprika', 1.25, 'ml'),
            self.ingredientDict('Black pepper', 2.5, 'ml'),
            self.ingredientDict('Cheddar cheese', 300, 'g'),
            self.ingredientDict('Breadcrumbs', 200, 'ml')
        ]

        instructions = [
            "Cook the pasta as indicated on the package",
            "Start the cheese sauce by melting 2 tbsp of butter in a small sauce pan over low heat",
            "Once melted, add the ﬂour and stir constantly until smooth and bubbly",
            "Continue stirring on low heat for 2 minutes to allow it to thicken",
            "Gradually add the milk and then the half and half, then raise the temperature if necessary",
            "Continue cooking for about 5 minutes to allow the mixture to thicken, stirring constantly",
            "Add the paprika and pepper, then stir in the cheese",
            "Continue stirring until completely melted, then remove from heat",
            "Line a casserole dish with butter and preheat the oven to 175°C",
            "Add the sauce to the cooked pasta, then move the pasta to the casserole dish",
            "Melt the rest of the butter and add it to the breadcrumbs",
            "Spread the breadcrumbs over the pasta",
            "Bake in a non-ventilated oven for 30 mins (set to 200° for our oven)",
            "Let cool for a few minutes before serving"
        ]

        with open("test_pdfs/Mac and Cheese.pdf", 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Baked Mac & Cheese", recipe['name'])
            self.assertEqual("", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_honey_sesame_chicken(self):
        """"""
        ingredients = [
            self.ingredientDict('Chicken breasts dice to 1-inch cubes', 1, 'lb'),
            self.ingredientDict('Coconut aminos', 1, 'tbsp'),
            self.ingredientDict('Coarse sea salt', 0.25, 'tsp'),
            self.ingredientDict('Baking soda', 0.5, 'tsp'),
            self.ingredientDict('Garlic powder', 0.25, 'tsp'),
            self.ingredientDict('Tapioca starch or potato starch (for stovetop), use 6 tbsp for air fryer', 4, 'tbsp'),
            self.ingredientDict('Whole yellow bell pepper diced into 1-inch cubes', 1, None),
            self.ingredientDict('French petite green beans trimmed and diced into 2.5-inch sections', 8, 'oz'),
            self.ingredientDict('Sweet chili sauce my homemade version makes about ⅓ cup', 0.333, ' cup(s)'),
            self.ingredientDict('Honey', 2, 'tbsp'),
            self.ingredientDict('Apple cider vinegar or white vinegar', 1, 'tbsp'),
            self.ingredientDict('Coconut aminos', 2, 'tsp'),
            self.ingredientDict('Coarse sea salt', 0.25, 'tsp'),
            self.ingredientDict('Tapioca starch', 1, 'tsp'),
            self.ingredientDict('+ 1 tbsp avocado oil for stovetop', 0.25, ' cup(s)'),
            self.ingredientDict('Avocado oil spray for air fryer', None, None),
            self.ingredientDict('Sprinkle toasted white sesame seeds', None, None)
        ]

        instructions = [
            "To prep",
            "Slice the chicken breasts into 1-inch cubes and in a bowl mix well with the seasonings from coconut aminos to starch",
            "Set aside in the fridge while you prepare other items",
            "Prepare the bell pepper and green beans",
            "Place the green beans in a microwave-safe container, add 1 tbsp water and microwave on high for 1 minute",
            "Drain the water and set them aside to cool",
            "In a separate bowl, stir well the sauce",

            "To pan fry",
            "In a 12-inch saute pan, add the avocado oil and preheat over medium heat for about 3 minutes",
            "Test the temperature with a wooden chopstick, if it shows bubbles around the chopstick when inserting it into the oil, the temperature is hot enough",
            "You can also use a thermometer to reach 350F/177C",
            "Add the chicken piece-by-piece into the pan",
            "Turn up the heat to medium-high",
            "Pan-fry them in a single layer without disturbing them for about 3 minutes on the first side",
            "Then use a chopstick or tong to cook the flip side for about 2 minutes",
            "Transfer them out to a separate plate",

            "To air-fry",
            "Preheat the air fryer to 380F",
            "Spray the basket with avocado oil and place the chicken piece-by-piece into the basket with some space between them",
            "Spray with more oil on top of each piece",
            "Air fry at 380F for 8 minutes total",
            "The chicken should be cooked through",
            "Repeat the process until you finish the batch",

            "To combine",
            "Add 1 tablespoon of oil to a well-heated large saute pan, when warm saute the pepper and green beans with 2 pinches of salt over medium-high heat for 1 minute",
            "Return the chicken to the pan and pour in the honey chili sauce",
            "Turn the heat up to high and toss to coat the sauce over for 1 minute",
            "Turn off the heat",
            "Transfer the food to a serving plate",
            "Garnish with sesame seeds",
            "Serve hot with steamed rice"
        ]

        with open("test_pdfs/Honey Sesame Chicken.pdf", 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Panda express honey sesame chicken", recipe['name'])
            self.assertEqual("https://iheartumami.com/wprm_print/panda-express-honey-sesame-chicken-recipe",
                             recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)

    def test_banana_muffins(self):
        """"""
        ingredients = [
            self.ingredientDict('Sugar', 160, 'g'),
            self.ingredientDict('All-purpose flour', 360, 'g'),
            self.ingredientDict('Baking powder', 8, 'g'),
            self.ingredientDict('A pinch of salt', None, None),
            self.ingredientDict('Banana pulp', 300, 'g'),
            self.ingredientDict('Eggs (at room temperature)', 60, 'g'),
            self.ingredientDict('Butter', 125, 'g'),
            self.ingredientDict('Whole milk (at room temperature)', 100, 'g'),
            self.ingredientDict('Dark chocolate', 120, 'g')
        ]

        instructions = [
            "Start by melting the butter over low heat in a small saucepan",
            "Let it cool",
            "In the meantime, peel the bananas",
            "Cut them into chunks and mash the pulp with a fork",
            "Once you have a coarse puree, add the egg and melted butter at room temperature",
            "Pour in the room-temperature milk and mix until the mixture is well combined",
            "Sift in the flour and baking powder, and mix until smooth",
            "Add the sugar, a pinch of salt, and mix again but don't overwork the batter",
            "Coarsely chop the chocolate and fold it into the batter",
            "Using an ice cream scoop, divide the batter into 12 muffin liners (5.5 cm diameter) placed in a muffin tray",
            "Alternatively, you can use a spoon or transfer the batter into a piping bag",
            "Bake in a preheated static oven at 170 degreesC for 45 minutes",
            "Check if they are done by inserting a toothpick",
            "Once baked, remove from the oven and let them cool slightly before enjoying"
        ]

        with open("test_pdfs/Banana_and_Chocolate_Chip_Muffins_Recipe.pdf", 'rb') as file:
            pdf_data = file.read()

            recipe = pdf_scraper.parse_recipe(pdf_data)

            self.assertEqual("Banana and Chocolate Chip Muffins Recipe", recipe['name'])
            self.assertEqual("", recipe['source'])

            self.assertListEqual(instructions, recipe['directions'])
            for idx, ing in enumerate(recipe['ingredients']):
                self.assertDictEqual(ingredients[idx], ing)


if __name__ == '__main__':
    unittest.main()
