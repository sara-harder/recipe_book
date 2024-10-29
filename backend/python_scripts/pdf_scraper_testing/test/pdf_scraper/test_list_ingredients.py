import unittest
import pdf_scraper


class TestGetQuantity(unittest.TestCase):
    def test_ingredient_1(self):
        """Test a basic ingredient string with multiple digits and no space before unit"""
        ingredient = "50g butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((50, 0, 2), res, msg='quantity_string={}'.format('50'))

    def test_ingredient_2(self):
        """Test a basic ingredient string with multiple digits and space before unit"""
        ingredient = "50 tsp flour"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((50, 0, 3), res, msg='quantity_string={}'.format('50'))

    def test_ingredient_3(self):
        """Test a basic ingredient string with one digit and no space before unit"""
        ingredient = "5g baking powder"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((5, 0, 1), res, msg='quantity_string={}'.format('5'))

    def test_ingredient_4(self):
        """Test a basic ingredient string with one digit and space before unit"""
        ingredient = "5 tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((5, 0, 2), res, msg='quantity_string={}'.format('5'))

    def test_unicode_1(self):
        """Test an ingredient string with digits then unicode and no space before unit"""
        ingredient = "1½tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 2), res, msg='quantity_string={}'.format('1½'))

    def test_unicode_2(self):
        """Test an ingredient string with digits then unicode and space before unit"""
        ingredient = "1½ tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 3), res, msg='quantity_string={}'.format('1½'))

    def test_unicode_3(self):
        """Test an ingredient string with digits, space, then unicode and no space before unit"""
        ingredient = "1 ½tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 3), res, msg='quantity_string={}'.format('1 ½'))

    def test_unicode_4(self):
        """Test an ingredient string with digits, space, then unicode and space before unit"""
        ingredient = "1 ½ tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 4), res, msg='quantity_string={}'.format('1 ½'))

    def test_unicode_5(self):
        """Test an ingredient string just unicode, no digits, and no space before unit"""
        ingredient = "½tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 1), res, msg='quantity_string={}'.format('½'))

    def test_unicode_6(self):
        """Test an ingredient string just unicode, no digits, and space before unit"""
        ingredient = "½ tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 2), res, msg='quantity_string={}'.format('½'))

    def test_char_fraction_1(self):
        """Test an ingredient string with digits then a written out fraction and no space before unit"""
        ingredient = "1 1/2tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 5), res, msg='quantity_string={}'.format('1 1/2'))

    def test_char_fraction_2(self):
        """Test an ingredient string with digits then a written out fraction and space before unit"""
        ingredient = "1 1/2 tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 6), res, msg='quantity_string={}'.format('1 1/2'))

    def test_char_fraction_3(self):
        """Test an ingredient string with digits then a written out fraction and no space before unit"""
        ingredient = "1 1/12tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.083, 0, 6), res, msg='quantity_string={}'.format('1 1/12'))

    def test_char_fraction_4(self):
        """Test an ingredient string with digits then a written out fraction and space before unit"""
        ingredient = "1 1/12 tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.083, 0, 7), res, msg='quantity_string={}'.format('1 1/12'))

    def test_char_fraction_5(self):
        """Test an ingredient string just a written out fraction, no digits, and no space before unit"""
        ingredient = "1/2tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 3), res, msg='quantity_string={}'.format('1/2'))

    def test_char_fraction_6(self):
        """Test an ingredient string just a written out fraction, no digits, and space before unit"""
        ingredient = "1/2 tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 4), res, msg='quantity_string={}'.format('1/2'))

    def test_char_fraction_7(self):
        """Test an ingredient string just a written out fraction, no digits, and no space before unit"""
        ingredient = "1/12tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.083, 0, 4), res, msg='quantity_string={}'.format('1/12'))

    def test_char_fraction_8(self):
        """Test an ingredient string just a written out fraction, no digits, and space before unit"""
        ingredient = "1/12 tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.083, 0, 5), res, msg='quantity_string={}'.format('1/12'))

    def test_char_fraction_9(self):
        """Test an ingredient string just a written out fraction, no digits, and no space before unit"""
        ingredient = "11/2tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((5.5, 0, 4), res, msg='quantity_string={}'.format('11/2'))

    def test_char_fraction_10(self):
        """Test an ingredient string just a written out fraction, no digits, and space before unit"""
        ingredient = "11/2 tbsp butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((5.5, 0, 5), res, msg='quantity_string={}'.format('11/2'))

    def test_or_symbol_1(self):
        """Test an ingredient with a hyphen indicating 'or' and no space before unit"""
        ingredient = "1-2tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 3), res, msg='quantity_string={}'.format('1-2'))

    def test_or_symbol_2(self):
        """Test an ingredient with "or" and space before unit."""
        ingredient = "1 or 2 tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 7), res, msg='quantity_string={}'.format('1 or 2'))

    def test_or_symbol_3(self):
        """Test an ingredient with an em dash and a written out fraction before the symbol"""
        ingredient = "1 1/2 — 2tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 9), res, msg='quantity_string={}'.format('1 1/2 — 2'))

    def test_or_symbol_4(self):
        """Test an ingredient with an en dash and a unicode fraction before the symbol"""
        ingredient = "1½ – 2tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 6), res, msg='quantity_string={}'.format('1½ – 2'))

    def test_or_symbol_5(self):
        """Test an ingredient with an em dash and a written out fraction before the symbol"""
        ingredient = "1/2 — 1tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 7), res, msg='quantity_string={}'.format('1/2 — 1'))

    def test_or_symbol_6(self):
        """Test an ingredient with an en dash and a unicode fraction before the symbol"""
        ingredient = "½ – 1tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 5), res, msg='quantity_string={}'.format('½ – 1'))

    def test_or_symbol_7(self):
        """Test an ingredient with an em dash and a written out fraction after the symbol"""
        ingredient = "1 — 1 1/2 tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 10), res, msg='quantity_string={}'.format('1 — 1 1/2'))

    def test_or_symbol_8(self):
        """Test an ingredient with an en dash and a unicode fraction after the symbol"""
        ingredient = "1 – 1½ tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 7), res, msg='quantity_string={}'.format('1 – 1½'))

    def test_or_symbol_9(self):
        """Test an ingredient with an em dash and a written out fraction after the symbol"""
        ingredient = "1 — 1/2 tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 8), res, msg='quantity_string={}'.format('1 — 1/2'))

    def test_or_symbol_10(self):
        """Test an ingredient with an en dash and a unicode fraction after the symbol"""
        ingredient = "1 – ½tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 5), res, msg='quantity_string={}'.format('1 – ½'))

    def test_or_symbol_11(self):
        """Test an ingredient with an em dash and written out fractions before and after the symbol"""
        ingredient = "1/3 — 1/2 tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.333, 0, 10), res, msg='quantity_string={}'.format('1/3 — 1/2'))

    def test_or_symbol_12(self):
        """Test an ingredient with an en dash and unicode fractions before and after the symbol"""
        ingredient = "⅓ – ½tbsp sugar"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.333, 0, 5), res, msg='quantity_string={}'.format('⅓ – ½'))

    def test_not_or_symbol_1(self):
        """Test an ingredient with a hyphen in the ingredient name, not in the quantity"""
        ingredient = "1 tbsp ground-beef"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 2), res, msg='quantity_string={}'.format('1'))

    def test_not_fraction_1(self):
        """Test an ingredient with a fraction in the name, not the quantity."""
        ingredient = "1 onion, cut into 1/2inch slices"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 2), res, msg='quantity_string={}'.format('1'))

    def test_not_or_symbol_2(self):
        """Test an ingredient with a hyphen and fractions in the ingredient name, not in the quantity"""
        ingredient = "1 onion, cut into 1/4-1/2inch slices"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 2), res, msg='quantity_string={}'.format('1'))

    def test_name_first_1(self):
        """Test an ingredient where name appears first, and no space before unit"""
        ingredient = "Butter, 50g"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((50, 8, 10), res, msg='quantity_string={}'.format('50'))

    def test_name_first_2(self):
        """Test an ingredient where name appears first, and space before unit"""
        ingredient = "Flour, 50 tsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((50, 7, 10), res, msg='quantity_string={}'.format('50'))

    def test_name_first_3(self):
        """Test an ingredient where name appears first, with a unicode fraction and space before unit"""
        ingredient = "Butter 1½ tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 7, 10), res, msg='quantity_string={}'.format('1½'))

    def test_name_first_4(self):
        """Test an ingredient where name appears first, with a unicode fraction and no space before unit"""
        ingredient = "Butter ½tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 7, 8), res, msg='quantity_string={}'.format('½'))

    def test_name_first_5(self):
        """Test an ingredient where name appears first, with a written out fraction and space before unit"""
        ingredient = "Butter, 1 1/12 tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.083, 8, 15), res, msg='quantity_string={}'.format('1 1/12'))

    def test_name_first_6(self):
        """Test an ingredient where name appears first, with a written out fraction and no space before unit"""
        ingredient = "Butter 1/2tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 7, 10), res, msg='quantity_string={}'.format('1/2'))

    def test_name_first_7(self):
        """Test an ingredient where name appears first, with 'or' in the quantity"""
        ingredient = "Sugar, 1 or 2 tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 7, 14), res, msg='quantity_string={}'.format('1 or 2'))

    def test_name_first_8(self):
        """Test an ingredient where name appears first, with a written out fraction then 'or' """
        ingredient = "Sugar, 1/2 or 1tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 7, 15), res, msg='quantity_string={}'.format('1/2 or 1'))

    def test_name_first_9(self):
        """Test an ingredient where name appears first, with a hyphen then a written out fraction"""
        ingredient = "Sugar, 1 - 1/2 tbsp"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 7, 15), res, msg='quantity_string={}'.format('1 - 1/2'))

    def test_name_first_10(self):
        """Test an ingredient where name appears first, with an em dash then a written out fraction"""
        ingredient = "Sugar, 1/3 — 1/2 cup"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.333, 7, 17), res, msg='quantity_string={}'.format('1/3 — 1/2'))

    def test_decimals_1(self):
        """Test an ingredient with a decimal and space before unit"""
        ingredient = "2.5 cups butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((2.5, 0, 4), res, msg='quantity_string={}'.format('2.5'))

    def test_decimals_2(self):
        """Test an ingredient with a decimal and no space before unit"""
        ingredient = "2.5cups butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((2.5, 0, 3), res, msg='quantity_string={}'.format('2.5'))

    def test_decimals_3(self):
        """Test an ingredient where name appears first, with a decimal and space before unit"""
        ingredient = "Butter, 2.5 cups"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((2.5, 8, 12), res, msg='quantity_string={}'.format('2.5'))

    def test_decimals_4(self):
        """Test an ingredient where name appears first, with a decimal and no space before unit"""
        ingredient = "Butter, 2.5cups"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((2.5, 8, 11), res, msg='quantity_string={}'.format('2.5'))

    def test_decimals_5(self):
        """Test an ingredient with a decimal without preceding digit"""
        ingredient = ".5 cups butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((0.5, 0, 3), res, msg='quantity_string={}'.format('.5'))

    def test_decimals_6(self):
        """Test an ingredient with a hyphen then a decimal number"""
        ingredient = "1-1.5 cups butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 6), res, msg='quantity_string={}'.format('1-1.5'))

    def test_decimals_7(self):
        """Test an ingredient with a hyphen, with decimal numbers before and after"""
        ingredient = "1.5-2.5 cups butter"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1.5, 0, 8), res, msg='quantity_string={}'.format('1.5-2.5'))

    def test_decimals_8(self):
        """Test an ingredient with 'or' then decimal number in the name, not the quantity"""
        ingredient = "1 cups butter or 1.5 cups margarine"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((1, 0, 2), res, msg='quantity_string={}'.format('1'))

    def test_no_quantity(self):
        """Test an ingredient where no quantity is specified"""
        ingredient = "Pepper"

        res = pdf_scraper.get_quantity(ingredient)

        self.assertEqual((None, None, None), res, msg='quantity_string={}'.format('none'))


class TestGetUnit(unittest.TestCase):
    def test_ingredient_1(self):
        """Test a basic ingredient with the name at the end"""
        ingredient = "50g butter"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('g', 4), res, msg='unit_string={}'.format('g'))

    def test_ingredient_2(self):
        """Test a basic ingredient with the name at the beginning"""
        ingredient = "Butter, 50g"

        res = pdf_scraper.get_unit(ingredient, 10)

        self.assertEqual(('g', 12), res, msg='unit_string={}'.format('g'))

    def test_fail_1(self):
        """Test a basic ingredient without a unit, with the name at the end"""
        ingredient = "50 peanuts"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual((None, 2), res, msg='unit_string={}'.format('none'))

    def test_fail_2(self):
        """Test a basic ingredient without a unit, with the name at the beginning"""
        ingredient = "Peanuts, 50"

        res = pdf_scraper.get_unit(ingredient, 11)

        self.assertEqual((None, 11), res, msg='unit_string={}'.format('none'))

    def test_ingredient_3(self):
        """Test ingredient with version 1 of unit 'tablespoon': tbsp"""
        ingredient = "1 tbsp sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 7), res, msg='unit_string={}'.format('tbsp'))

    def test_ingredient_4(self):
        """Test ingredient with version 2 of unit 'tablespoon': tblsp"""
        ingredient = "1 tblsp sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 8), res, msg='unit_string={}'.format('tblsp'))

    def test_ingredient_5(self):
        """Test ingredient with version 3 of unit 'tablespoon': tablespoon"""
        ingredient = "1 tablespoon sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 13), res, msg='unit_string={}'.format('tablespoon'))

    def test_ingredient_6(self):
        """Test ingredient with version 4 of unit 'tablespoon': tablespoons"""
        ingredient = "2 tablespoons sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 14), res, msg='unit_string={}'.format('tablespoons'))

    def test_ingredient_7(self):
        """Test ingredient with version 5 of unit 'tablespoon': tablespoon(s)"""
        ingredient = "1-2 tablespoon(s) sugar"

        res = pdf_scraper.get_unit(ingredient, 4)

        self.assertEqual(('tbsp', 18), res, msg='unit_string={}'.format('tablespoon(s)'))

    def test_ingredient_8(self):
        """Test ingredient with uppercase unit 'tablespoon': TBSP"""
        ingredient = "1 TBSP sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 7), res, msg='unit_string={}'.format('TBSP'))

    def test_ingredient_9(self):
        """Test ingredient with period after unit 'tablespoon': Tbsp."""
        ingredient = "1 Tbsp. sugar"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('tbsp', 8), res, msg='unit_string={}'.format('Tbsp.'))

    def test_ingredient_12(self):
        """Test ingredient with valid unit that includes a space"""
        ingredient = "5fl oz milk"

        res = pdf_scraper.get_unit(ingredient, 1)

        self.assertEqual(('fl oz', 7), res, msg='unit_string={}'.format('fl oz'))

    def test_ingredient_13(self):
        """Test ingredient with valid unit that includes a space"""
        ingredient = "5 fluid ounces milk"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual(('fl oz', 15), res, msg='unit_string={}'.format('fluid ounces'))

    def test_ingredient_14(self):
        """Test ingredient with invalid unit that includes a space"""
        ingredient = "5 fluid pounds milk"

        res = pdf_scraper.get_unit(ingredient, 2)

        self.assertEqual((None, 2), res, msg='unit_string={}'.format('fluid pounds'))


class TestGetName(unittest.TestCase):
    def test_ingredient_1(self):
        """Test a basic ingredient with the name at the end"""
        ingredient = "50g butter"

        res = pdf_scraper.get_name(ingredient, 0, 4)

        self.assertEqual('Butter', res, msg='name={}, position={}'.format('butter', 'end'))

    def test_ingredient_2(self):
        """Test a basic ingredient with the name at the beginning"""
        ingredient = "Butter, 50g"

        res = pdf_scraper.get_name(ingredient, 8, 11)

        self.assertEqual('Butter', res, msg='name={}, position={}'.format('Butter, ', 'beginning'))

    def test_ingredient_3(self):
        """Test an ingredient with the name at the end and parentheses right before the name"""
        ingredient = "10g (per person) sugar"

        res = pdf_scraper.get_name(ingredient, 0, 4)

        self.assertEqual('Sugar', res, msg='name={}, position={}'.format('sugar', 'end'))

    def test_ingredient_4(self):
        """Test an ingredient with the name at the beginning and parentheses as part of the name"""
        ingredient = "SUGAR (per person), 10g"

        res = pdf_scraper.get_name(ingredient, 20, 40)

        self.assertEqual('Sugar (per person)', res, msg='name={}, position={}'.format('SUGAR', 'beginning'))

    def test_ingredient_5(self):
        """Test an ingredient with a hyphen-prefixed name at the end"""
        ingredient = "50g -butter, "

        res = pdf_scraper.get_name(ingredient, 0, 4)

        self.assertEqual('Butter', res, msg='name={}, position={}'.format('-butter, ', 'end'))

    def test_ingredient_6(self):
        """Test an ingredient with a middle-hyphenated name at the end"""
        ingredient = "50g peanut-butter"

        res = pdf_scraper.get_name(ingredient, 0, 4)

        self.assertEqual('Peanut-butter', res, msg='name={}, position={}'.format('peanut-butter', 'end'))

    def test_ingredient_7(self):
        """Test an ingredient with a name composed of just a single letter at the end"""
        ingredient = "2tbsp X"

        res = pdf_scraper.get_name(ingredient, 0, 6)

        self.assertIsNone(res, msg='name={}, position={}'.format('X', 'end'))

    def test_ingredient_8(self):
        """Test an ingredient with a name composed of just a single letter at the beginning"""
        ingredient = "X 2 tbsp"

        res = pdf_scraper.get_name(ingredient, 2, 8)

        self.assertIsNone(res, msg='name={}, position={}'.format('X', 'beginning'))

    def test_ingredient_9(self):
        """Test an ingredient with no name"""
        ingredient = "2 tbsp"

        res = pdf_scraper.get_name(ingredient, 0, 6)

        self.assertIsNone(res, msg='name={}, position={}'.format('no name', 'none'))

    def test_ingredient_10(self):
        """Test an ingredient with a name composed of exactly two letters at the end"""
        ingredient = "1 te"

        res = pdf_scraper.get_name(ingredient, 0, 2)

        self.assertEqual('Te', res, msg='name={}, position={}'.format('te', 'end'))


class TestListIngredients(unittest.TestCase):
    @staticmethod
    def ingredientDict(name, quantity, unit):
        return {
            'name': name,
            'quantity': quantity,
            'unit': unit
        }

    @classmethod
    def setUpClass(cls):
        cls.expected = [
                        cls.ingredientDict('Butter', 100, 'g'),
                        cls.ingredientDict('Sugar', 3, 'tbsp'),
                        cls.ingredientDict('Flour', 5.5, ' cup(s)'),
                        cls.ingredientDict('Vanilla', 2.5, 'tsp'),
                        cls.ingredientDict('Eggs', 0.5, None),
                        cls.ingredientDict('Water', 4, 'fl oz'),
                       ]

    def test_ingredients_1(self):
        """Test a basic string of ingredients"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_2(self):
        """Test a string of ingredients prefixed by hyphens"""
        ingredients = "-100g butter\n- Sugar, 3-4 tbsp \n-5 1/2 cups FLOUR " \
                      "\n -2.5tsp vanilla\n-Eggs, ½\n---4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_3(self):
        """Test a string of ingredients prefixed by bullets"""
        ingredients = "·100g butter\n· Sugar, 3-4 tbsp \n·5 1/2 cups FLOUR " \
                      "\n ·2.5tsp vanilla\n·Eggs, ½\n··4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_4(self):
        """Test a numbered list of ingredients"""
        ingredients = "1. 100g butter\n2. Sugar, 3-4 tbsp \n3. 5 1/2 cups FLOUR " \
                      "\n 4. 2.5tsp vanilla\n5. Eggs, ½\n6. 4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_5(self):
        """Test a string of ingredients with parentheses around one ingredient"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n(4 fl oz water)"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_6(self):
        """Test a string of ingredients with parentheses around just part of one ingredient"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water\nPepper (to taste)"

        res = pdf_scraper.list_ingredients(ingredients)

        expected = self.expected + [self.ingredientDict("Pepper (to taste)", None, None)]

        for idx, ing in enumerate(res):
            self.assertDictEqual(expected[idx], ing.to_dict())

    def test_ingredients_7(self):
        """Test a string of ingredients with an invalid last ingredient made of symbols"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water\n###@#@"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_8(self):
        """Test a string of ingredients with an invalid last ingredient made of numbers. Invalid ingredient is not
        included in resulting list"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water\n1/2"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_9(self):
        """Test a string of ingredients with invalid first ingredients containing <2 letters. Invalid ingredients are
        not included in resulting list"""
        ingredients = "1x\n 2\nX\n100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())

    def test_ingredients_10(self):
        """Test a string of ingredients with a valid last ingredient containing exactly 2 letters"""
        ingredients = "100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\n4 fl oz water\n1/2 te"

        res = pdf_scraper.list_ingredients(ingredients)
        expected = self.expected + [self.ingredientDict('Te', 0.5, None)]

        for idx, ing in enumerate(res):
            self.assertDictEqual(expected[idx], ing.to_dict())

    def test_ingredients_11(self):
        """Test a string of ingredients with invalid lines delineating sections. These contain an ending colon.
        Invalid lines are not included in resulting list"""
        ingredients = "For the dough: \n100g butter\n Sugar, 3-4 tbsp \n5 1/2 cups FLOUR " \
                      "\n 2.5tsp vanilla\nEggs, ½\nIf too dry:\n4 fl oz water"

        res = pdf_scraper.list_ingredients(ingredients)

        for idx, ing in enumerate(res):
            self.assertDictEqual(self.expected[idx], ing.to_dict())



if __name__ == '__main__':
    unittest.main()
