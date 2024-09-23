// this is a simple script to convert the questions from yaml to json so it can be used in the playground and chart component

import yaml from "js-yaml";
import fs from "fs";

const generate = async () => {
  const QS: Record<string, SurveyQuestion> = {};
  // Get document, or throw exception on error
  try {
    const profile = (await yaml.load(
      fs.readFileSync("./survey/1-profile.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const learning = (await yaml.load(
      fs.readFileSync("./survey/2-learning-and-education.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const work = (await yaml.load(
      fs.readFileSync("./survey/3-work.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const ai = (await yaml.load(
      fs.readFileSync("./survey/4-ai.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const tech = (await yaml.load(
      fs.readFileSync("./survey/5-tech.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const community = (await yaml.load(
      fs.readFileSync("./survey/6-community.yml", "utf8")
    )) as SurveyQuestionsYamlFile;
    const data = [profile, learning, work, tech, ai, community];

    data.forEach(({ label, questions }) => {
      questions.forEach((element, index: number) => {
        const id = `${label}-q-${index}`;
        console.log(id);
        QS[id] = {
          ...element,
          multiple: element.multiple ?? false, // default to false
          required: element.required ?? true // default to true
        };
      });
    });

    writeToFile("./scripts/questions.json", QS);

    console.log(QS);
  } catch (e) {
    console.log(e);
  }
};

function writeToFile(filename: string, data: Record<string, SurveyQuestion>) {
  fs.writeFile(filename, JSON.stringify(data), (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`[SUCCESS] ${new Date()} JSON saved to ${filename}`);
    }
  });
}

generate();
