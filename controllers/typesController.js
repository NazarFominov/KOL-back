const ElementType = require("models/elementType")
const ListType = require("models/list/listType")
const {RecipeType} = require("models/list/recipe/recipeType")
const {RecipeCategory} = require("models/list/recipe/categoryRecipe")
const {RecipeIngredient} = require("models/list/recipe/ingredientRecipe")

exports.getElementTypes = function (req, res) {
    ElementType.find({})
        .exec(function (err, types) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            types = types.map(t => ({
                id: t._id,
                name: t._doc.name,
                type: t._doc.type
            }))

            res.status(200);
            res.end(JSON.stringify(types))
        });
}

exports.getListTypes = async function (req, res) {
    ListType.find({})
        .exec(function (err, types) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            types = types.map(t => ({
                id: t._id,
                name: t._doc.name,
                type: t._doc.type,
                isSelectable: t._doc.isSelectable
            })).sort((a, b) => a.name > b.name ? 1 : -1)

            res.status(200);
            res.end(JSON.stringify(types))
        });
}

exports.addRecipeType = async function (req, res) {
    const {body} = req;
    if (!body) return res.sendStatus(500)

    const {type, name} = body;
    if (!type || !name) return res.sendStatus(500)

    await RecipeType.create({
        type: type,
        name: name
    })

    res.sendStatus(204)
}

exports.getRecipeTypes = async function (req, res) {
    const recipeTypes = await RecipeType.find({}).exec();

    res.status(200);
    res.end(JSON.stringify(recipeTypes.map(r => ({type: r.type, name: r.name, id: r._id}))))
}

exports.addRecipeCategory = async function (req, res) {
    const {body} = req;
    if (!body) return res.sendStatus(500)

    const {type, name} = body;
    if (!type || !name) return res.sendStatus(500)

    await RecipeCategory.create({
        type: type,
        name: name
    })

    res.sendStatus(204)
}

exports.getRecipeCategories = async function (req, res) {
    const recipeTypes = await RecipeCategory.find({}).exec();

    res.status(200);
    res.end(JSON.stringify(recipeTypes.map(r => ({type: r.type, name: r.name, id: r._id}))))
}

exports.addRecipeIngredient = async function (req, res) {
    const {body} = req;
    if (!body) return res.sendStatus(500)

    const {name} = body;
    if (!name) return res.sendStatus(500)

    await RecipeIngredient.create({
        name: name
    })

    res.sendStatus(204)
}

exports.getRecipeIngredients = async function (req, res) {
    const recipeTypes = await RecipeIngredient.find({}).exec();

    res.status(200);
    res.end(JSON.stringify(recipeTypes.map(r => ({type: r.type, name: r.name, id: r._id}))))
}