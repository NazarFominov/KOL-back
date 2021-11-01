const Element = require("models/element")
const List = require("models/list/list")
const NoteList = require("models/list/noteList")
const MenuList = require("models/list/menuList")
const RecipeList = require("models/list/recipe/recipeList")
const Recipe = require("models/list/recipe/recipe")
const {getOneListByElementId} = require("./generalFunctions");

async function populateMenu(menu) {
    const m = Object.fromEntries(menu)
    for (let key in m) {
        for (let variantIndex = 0; variantIndex < m[key].length; variantIndex++) {
            for (let recipeIndex = 0; recipeIndex < m[key][variantIndex].length; recipeIndex++) {
                let recipe = await Recipe.findById(m[key][variantIndex][recipeIndex]);
                recipe = await Recipe.populate(recipe, [{path: 'types'}, {path: 'categories'}, {path: 'ingredients'}]);
                m[key][variantIndex][recipeIndex] = recipe;
            }
        }
    }
    return m;
}

exports.editNote = async function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {text, id} = req.body;

    if (!id) return res.sendStatus(500);

    try {
        const list = await getOneListByElementId(id, req);
        if (list === null) res.sendStatus(404);

        const note = await NoteList.findOne({list: list._id}).exec()
        if (note === null) {
            await NoteList.create({
                text: text,
                list: list._id
            })

            res.sendStatus(204)
        } else {
            await NoteList.findOneAndUpdate({list: list._id}, {text: text})
            await Element.findByIdAndUpdate(id, {timeOfEditing: new Date()})

            res.sendStatus(204)
        }

    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
}

exports.getNote = async function (req, res) {
    try {
        const {id} = req.query;

        if (!id) return res.sendStatus(500)

        const list = await getOneListByElementId(id, req);
        if (list == null) return res.sendStatus(500)

        const note = await NoteList.findOne({list: list._id})
        if (note === null) {
            res.status(200)
            return res.end(JSON.stringify({text: null}))
        }

        res.status(200)
        res.end(JSON.stringify({id: note._id, text: note.text}))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.deleteNoteByListId = async function (id) {
    if (!id) return null
    try {
        await NoteList.deleteOne({list: id}, null)
    } catch (e) {
        console.log(e);
        return null
    }
}

exports.addRecipe = async function (req, res) {
    try {
        if (!req.body) return res.sendStatus(500);
        const recipe = req.body;

        const {elementId} = req.params;
        if (!elementId) return res.sendStatus(500);

        let list = await getOneListByElementId(elementId, req);
        if (!list) return res.sendStatus(404);

        let recipeList = await RecipeList.findOne({list: list._id})
        const _recipe = await Recipe.create({
            name: recipe.name || "Нет названия",
            types: recipe.types || [],
            categories: recipe.categories || [],
            ingredients: recipe.ingredients || [],
            difficulty: recipe.difficulty || 2,
            loveLevel: recipe.loveLevel || 3,
            link: recipe.link || null,
            note: recipe.note || null,
        })

        if (recipeList !== null) {
            await RecipeList.findByIdAndUpdate(recipeList._id, {recipes: [...recipeList.recipes, _recipe._id]})
        } else {
            await RecipeList.create({
                list: list._id,
                recipes: [_recipe._id]
            })
        }

        return res.sendStatus(204);
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.editRecipe = async function (req, res) {
    try {
        if (!req.body) return res.sendStatus(500);
        const recipe = req.body;

        const {elementId, recipeId} = req.params;
        if (!elementId || !recipeId) return res.sendStatus(500);

        let list = await getOneListByElementId(elementId, req);
        if (!list) return res.sendStatus(404);

        let recipeList = await RecipeList.findOne({list: list._id})
        if (!recipeList) return res.sendStatus(404);

        const _recipe = {
            name: recipe.name || "Нет названия",
            types: recipe.types || [],
            categories: recipe.categories || [],
            ingredients: recipe.ingredients || [],
            difficulty: recipe.difficulty || 2,
            loveLevel: recipe.loveLevel || 3,
            link: recipe.link || null,
            note: recipe.note || null,
        }

        await Recipe.findByIdAndUpdate(recipeId, _recipe)

        return res.sendStatus(204);
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.getRecipes = async function (req, res) {
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
        for (let recipe of recipes) {
            recipe = await Recipe.populate(recipe, [{path: 'types'}, {path: 'categories'}, {path: 'ingredients'}]);
        }

        recipes = recipes.map(r => ({
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

        res.status(200)
        res.end(JSON.stringify(recipes))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.deleteRecipe = async function (req, res) {
    try {
        if (!req.body) return res.sendStatus(500);

        const {elementId, recipeId} = req.params;
        if (!elementId || !recipeId) return res.sendStatus(500);

        let list = await getOneListByElementId(elementId, req);
        if (!list) return res.sendStatus(404);

        let recipeList = await RecipeList.findOne({list: list._id})
        if (!recipeList) return res.sendStatus(500);

        const newRecipes = recipeList.recipes.filter(r => r.toString() !== recipeId.toString());
        await RecipeList.findByIdAndUpdate(recipeList._id, {recipes: newRecipes})
        await Recipe.findByIdAndDelete(recipeId)

        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.deleteRecipeListByListId = async function (id) {
    if (!id) return null
    try {
        const list = await RecipeList.findOneAndDelete({list: id})
        await Recipe.deleteMany({_id: {$in: list.recipes}})
    } catch (e) {
        console.log(e);
        return null
    }
}

exports.editMenu = async function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {id} = req.body;

    if (!id || !req.body.menu) return res.sendStatus(500);

    try {
        const list = await getOneListByElementId(id, req);
        if (list === null) res.sendStatus(404);

        const menu = await MenuList.findOne({list: list._id}).exec()
        if (menu === null) await MenuList.create({
            list: list._id,
            menu: req.body.menu
        })
        else await MenuList.findOneAndUpdate({list: list._id}, {menu: req.body.menu})
        await Element.findByIdAndUpdate(id, {timeOfEditing: new Date()})

        res.sendStatus(204)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
}

exports.getMenu = async function (req, res) {
    try {
        const {id} = req.query;

        if (!id) return res.sendStatus(500)

        const list = await getOneListByElementId(id, req);
        if (list == null) return res.sendStatus(500)

        let menu = await MenuList.findOne({list: list._id})

        res.status(200)
        if (menu === null) {
            return res.end(JSON.stringify({menu: null}))
        }

        await populateMenu(menu.menu)

        res.end(JSON.stringify({id: menu._id, menu: menu.menu}))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.getLastMenu = async function (req, res) {
    try {
        let menu;
        const menus = await MenuList.find({})
        if (menus.length > 1) {
            for (let menu of menus) {
                await MenuList.populate(menu, {path: 'list'})
            }
            for (let menu of menus) {
                await List.populate(menu.list, {path: 'list'})
            }

            menus.sort((a, b) => new Date(b.list.list.timeOfEditing) - new Date(a.list.list.timeOfEditing));
            menu = menus[0];
        } else menu = menus[0];

        await populateMenu(menu.menu);

        res.status(200)
        res.end(JSON.stringify({id: menu._id, menu: menu.menu}))
    } catch (e) {
        console.log(e)
        res.sendStatus(501)
    }
}

exports.deleteMenuByListId = async function (id) {
    if (!id) return null
    try {
        await MenuList.deleteOne({list: id}, null)
    } catch (e) {
        console.log(e);
        return null
    }
}
