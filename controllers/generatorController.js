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

        Object.keys(menu).forEach((key) => {
            menu[key] = menu[key].map((r) => [{
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
            }])
        })

        for (let key in menu) {
            for (let recipes of menu[key]) {
                for (let recipe of recipes) {
                    await Recipe.findByIdAndUpdate(recipe.id, {priority: (recipe.priority || 0) + (16 - ((4 - recipe.difficulty) * recipe.loveLevel))})
                }
            }
        }

        res.status(200);
        res.end(JSON.stringify(menu))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.getRecipe = async function (req, res) {
    try {
        const {id, typeId, categoryId} = req.query;

        if (!id && !(typeId || categoryId)) return res.sendStatus(500)

        const list = await getOneListByElementId(id, req);
        if (list == null) return res.sendStatus(500)

        let recipeList = await RecipeList.findOne({list: list._id})
        if (recipeList === null) {
            res.status(204)
            return res.end(JSON.stringify(null))
        }

        let {recipes} = await RecipeList.populate(recipeList, {path: 'recipes'})
        recipes.sort((a, b) => a.priority < b.priority ? -1 : 1);

        let recipeNeeded;
        for (let i = 0; i < recipes.length; i++) {
            if (typeId && !recipes[i].types.includes(typeId)) continue;
            if (categoryId && !recipes[i].categories.includes(categoryId)) continue;

            recipeNeeded = recipes[i];
            break;
        }

        if (!recipeNeeded) {
            res.status(204)
            return res.end(JSON.stringify(null))
        }

        recipeNeeded = await Recipe.populate(recipeNeeded, [{path: 'types'}, {path: 'categories'}, {path: 'ingredients'}]);

        recipeNeeded = {
            id: recipeNeeded._id,
            name: recipeNeeded.name,
            types: recipeNeeded.types.map(el => ({
                id: el._id,
                name: el.name,
                type: el.type || null
            })),
            categories: recipeNeeded.categories.map(el => ({
                id: el._id,
                name: el.name,
                type: el.type || null
            })),
            ingredients: recipeNeeded.ingredients.map(el => ({
                id: el._id,
                name: el.name,
                type: el.type || null
            })),
            difficulty: recipeNeeded.difficulty,
            loveLevel: recipeNeeded.loveLevel,
            link: recipeNeeded.link,
            note: recipeNeeded.note,
            priority: recipeNeeded.priority
        }

        await Recipe.findByIdAndUpdate(recipeNeeded.id, {priority: (recipeNeeded.priority || 0) + (16 - ((4 - recipeNeeded.difficulty) * recipeNeeded.loveLevel))})

        res.status(200);
        res.end(JSON.stringify(recipeNeeded))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}