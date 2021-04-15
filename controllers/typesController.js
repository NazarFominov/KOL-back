const ElementType = require("models/elementType")
const ListType = require("models/listType")
const {RecipeType} = require("models/forRecipe/typesForRecipe")
const {RecipeCategory} = require("models/forRecipe/categoriesForRecipe")
const {RecipeIngredient} = require("models/forRecipe/ingredientsForRecipe")
const path = require("path")

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

exports.getListTypes = function (req, res) {
    ListType.find({})
        .exec(function (err, types) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            types = types.map(t => ({
                id: t._id,
                name: t._doc.name,
                type: t._doc.type
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
    res.end(JSON.stringify(recipeTypes))
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
    res.end(JSON.stringify(recipeTypes))
}

exports.addRecipeIngredient = async function (req, res) {
    const {body} = req;
    if (!body) return res.sendStatus(500)

    const {type, name} = body;
    if (!type || !name) return res.sendStatus(500)

    await RecipeIngredient.create({
        type: type,
        name: name
    })

    res.sendStatus(204)
}

exports.getRecipeIngredients = async function (req, res) {
    const recipeTypes = await RecipeIngredient.find({}).exec();

    res.status(200);
    res.end(JSON.stringify(recipeTypes))
}