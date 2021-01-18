# Better-Choice-at-McDonald-s
Take McDonald’s menu and nutrition data as a source, we propose a visualization to present various nutrition indexes such as calories, fat, Cholesterol, etc. for each product in McDonald’s, divide those indexes into healthy and unhealthy categories according to the user’s input of his nutrition standard initially, and recommend several personalized optimal sets of meals for the user.

Our dataset contains 260 products of McDonald’s in the type of table from the
Kaggle dataset. The dataset consists of 9 categories including Breakfast, Beef & Pork,
Chicken & Fish, Salads, Snacks & Sides, Desserts, Beverages, Coffee & Tea, Smoothies &
Shakes. Each product within that category has its corresponding serving size and 21
nutrition indexes, including calories, total fat, cholesterol, sodium, etc. Every attribute is
quantitative.

For usage scenarios, we hope the user can compare his preferred nutrition standard with each item Mcdonald’s provides when he browse the menu to have a better understanding of what he decides to eat. Then based on his standard, we use our algorithm to provide a recommended set of meals for reference.

For visualization language, on the homepage, we construct a zoomable treemap to represent the menu, as it fits the containment link. When the user selects each category, the related bar graph with index differences will show, as the aligned position is best for qualitative data comparison. We specified different colors for categorical data. On the recommendation page, we draw a collapsible tree for the recommendation set of meals, as it can show the result for the user at the first glance while maintaining the containment.
