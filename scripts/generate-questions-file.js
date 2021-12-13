const yaml = require("js-yaml")
const fs = require("fs")

const generate = async () => {
  const QS = {}
  // Get document, or throw exception on error
  try {
    const profile = await yaml.load(
      fs.readFileSync("./survey/1-profile.yml", "utf8")
    )
    const learning = await yaml.load(
      fs.readFileSync("./survey/2-learning-and-education.yml", "utf8")
    )
    const work = await yaml.load(fs.readFileSync("./survey/3-work.yml", "utf8"))
    const tech = await yaml.load(fs.readFileSync("./survey/4-tech.yml", "utf8"))
    const community = yaml.load(
      fs.readFileSync("./survey/5-community.yml", "utf8")
    )
    const data = [profile, learning, work, tech, community]

    data.forEach(({ label, questions }) => {
      questions.forEach((element, index) => {
        const id = `${label}-q-${index}`
        console.log(id)
        QS[id] = {
          multiple: null,
          ...element,
        }
      })
    })

    writeToFile("./questions.json", QS)

    console.log(QS)
  } catch (e) {
    console.log(e)
  }
}

generate()

function writeToFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data), err => {
    if (err) {
      console.log(err)
    } else {
      console.log(`[SUCCESS] ${new Date()} JSON saved to ${filename}`)
    }
  })
}
