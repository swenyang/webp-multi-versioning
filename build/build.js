const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const colors = require('colors')
const webpack = require('webpack')

const getWebpackConfig = require('./getWebpackConfig.js')

const htmlTemplateSrc = fs.readFileSync(path.join(__dirname, '../src/index.template.html'))
const jsTemplateSrc = fs.readFileSync(path.join(__dirname, './js.template.html'))
const htmlTemplate = _.template(htmlTemplateSrc)
const jsTemplate = _.template(jsTemplateSrc)

const root = path.join(__dirname, '../dist')

console.log(colors.bold(colors.underline('[BUILD] START')))
fsExtra.removeSync(root)

const handleErrors = (err) => {
    console.log(colors.red(err))
    console.log(colors.bold(colors.underline('[BUILD] FAIL')))
}

const handleWarnings = (warnings) => {
    console.log(colors.yellow('[BUILD] WARNINGS'))
    console.log(colors.yellow(warnings))
}

const getJsList = (stats) => {
    const ret = []
    stats.assets.map((elem) => {
        if (elem.name.endsWith('.js')) {
            ret.push(elem.name)
        }
        return null
    })
    return ret
}

const injectScriptsToHtml = (list, listWebP, cb) => {
    let html = htmlTemplate({
        htmlWebpackPlugin: {
            options: {},
        },
    })
    const jsList = jsTemplate({
        jsList: list,
        jsListWebP: listWebP,
    })
    html = html.replace(/<\/body>/i, match => jsList + match)

    fs.writeFileSync(path.join(root, 'index.html'), html)
}

const buildWebpack = isWebP => new Promise((resolve, reject) => {
    const config = getWebpackConfig(isWebP)
    webpack(config, (err, stats) => {
        if (err) {
            handleErrors(err)
            reject(err)
        }
        const jsonStats = stats.toJson()
        if (jsonStats.errors.length > 0) {
            handleErrors(jsonStats.errors)
            reject(jsonStats.errors)
        }
        if (jsonStats.warnings.length > 0) {
            handleWarnings(jsonStats.warnings)
        }
        fsExtra.writeJsonSync(`./build${isWebP ? '.webp' : ''}.log`, jsonStats)
        resolve(jsonStats)
    })
})

let totalTime = 0
console.log(colors.bold('[BUILD] png version'))
buildWebpack(false).then((jsonStats) => {
    totalTime += jsonStats.time
    process.env.NODE_ENV_IMAGE = 'webp'
    console.log(colors.bold('[BUILD] webp version'))

    buildWebpack(true).then((jsonStatsWebp) => {
        totalTime += jsonStatsWebp.time
        injectScriptsToHtml(getJsList(jsonStats), getJsList(jsonStatsWebp))
        console.log(colors.bold(colors.underline('[BUILD] DONE')))
        console.log(`Total time: ${totalTime / 1000}s`)
    })
})
