const Recipe = require("models/list/recipe/recipe");
const {RecipeType} = require("models/list/recipe/recipeType");
const {getOneListByElementId} = require("./generalFunctions");
const RecipeList = require("models/list/recipe/recipeList");

exports.getMenu = async function (req, res) {
    try {
        const {id} = req.query;

        if (!id) return res.sendStatus(500)

        const list = await getOneListByElementId(id, req);
        if (list == null) return res.sendStatus(500)

        let recipeList = await RecipeList.findOne({list: list._id})
        if (recipeList === null) {
            res.status(200)
            return res.end(JSON.stringify([]))
        }

        let {recipes} = await RecipeList.populate(recipeList, {path: 'recipes'})
        recipes.sort((a, b) => a.priority < b.priority ? -1 : 1);

        const recipeTypes = await RecipeType.find({});

        function getRecipesByType(type, count = 10) {
            let suitableRecipes = [];
            for (let i = 0; i < recipes.length && suitableRecipes.length !== count; i++) {
                if (recipes[i].types.includes(type.id)) suitableRecipes.push(recipes[i])
            }
            return suitableRecipes;
        }

        const menu = {};
        recipeTypes.forEach(t => {
            if (req.query[t.type]) menu[t.type] = getRecipesByType(t, parseInt(req.query[t.type]) || 0)
        })

        for (let key in menu) {
            for (let recipe of menu[key]) {
                recipe = await Recipe.populate(recipe, [{path: 'types'}, {path: 'categories'}, {path: 'ingredients'}]);
            }
        }

        Object.keys(menu).forEach((key, i) => {
            menu[key] = menu[key].map((r) => ({
                id: r._id,
                name: r.name,
                types: r.types.map(el => ({
                    id: el._id,
                    name: el.name,
                    type: el.type || null
                })),
                categories: r.categories.map(el => ({
                    id: el._id,
                    name: el.name,
                    type: el.type || null
                })),
                ingredients: r.ingredients.map(el => ({
                    id: el._id,
                    name: el.name,
                    type: el.type || null
                })),
                difficulty: r.difficulty,
                loveLevel: r.loveLevel,
                link: r.link,
                note: r.note,
                priority: r.priority
            }))
        })

        for (let key in menu) {
            for (let recipe of menu[key]) {
                console.log(recipe)
                await Recipe.findByIdAndUpdate(recipe.id, {priority: (recipe.priority || 0) + (16 - ((4 - recipe.difficulty) * recipe.loveLevel))})
            }
        }

        res.status(200);
        res.end(JSON.stringify(menu))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}