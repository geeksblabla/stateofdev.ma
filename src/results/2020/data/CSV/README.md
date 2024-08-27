# Overview

This notebook :notebook: applies some basic preproccessing on the raw survey results, mainly:
- Transforming the "JSON" files into "CSV" which is more friendly and common for data analysis tasks.
- Decoding the questions and answers values to natural language categories, in order to use for future work. 


---
**A public version of the Dataset is hoted on Kaggel :blue_book: :bar_chart: :chart_with_upwards_trend: 
[View on Kaggle](https://www.kaggle.com/amr009/state-of-dev-mrocco-2020)**
---


## Input: :rewind:
### Raw answers in JSON:

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>userId</th>
      <th>community-q-4</th>
      <th>lastSubmit</th>
      <th>tech-q-1</th>
      <th>...</th>
      <th>profile-q-12</th>
      <th>profile-q-1</th>
      <th>__collections__</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>01jKBLnYhGTy3xztjuhVIf2jass1</td>
      <td>0.0</td>
      <td>1603211692917</td>
      <td>[0]</td>
      <td>...</td>
      <td>1</td>
      <td>2</td>
      <td>None</td>
    </tr>
    <tr>
      <th>1</th>
      <td>020TufnjwQTTT0C7jzE0BYz39j53</td>
      <td>NaN</td>
      <td>1604010020407</td>
      <td>NaN</td>
      <td>...</td>
      <td>0</td>
      <td>2</td>
      <td>None</td>
    </tr>
    <tr>
      <th>2</th>
      <td>03RLF3jf97R8Hb49KJCOAWoipiB2</td>
      <td>0.0</td>
      <td>1603210798458</td>
      <td>[6, 8, 11]</td>
      <td>...</td>
      <td>1</td>
      <td>2</td>
      <td>None</td>
    </tr>
    <tr>
      <th>3</th>
      <td>03iq2uFIwNOqgNw01FF2AViQr9B3</td>
      <td>NaN</td>
      <td>1603449369739</td>
      <td>NaN</td>
      <td>...</td>
      <td>1</td>
      <td>2</td>
      <td>None</td>
    </tr>
  </tbody>
</table>

### Raw questions in JSON:

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>profile-q-0</th>
      <th>profile-q-1</th>
      <th>profile-q-2</th>
      <th>...</th>
      <th>community-q-6</th>
      <th>community-q-7</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>label</th>
      <td>What is your gender?</td>
      <td>What is your age?</td>
      <td>Where are you currently located?</td>
      <td>...</td>
      <td>Are you part of one of the Moroccan Facebook D...</td>
      <td>How do you evaluate the Moroccan Tech Community?</td>
    </tr>
    <tr>
      <th>required</th>
      <td>True</td>
      <td>True</td>
      <td>True</td>
      <td>...</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>multiple</th>
      <td>False</td>
      <td>None</td>
      <td>None</td>
      <td>...</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>choices</th>
      <td>[Male, Female]</td>
      <td>[Younger than 15 years, 15 to 19 years, 20 to ...</td>
      <td>[Morocco, Europe, US, Others]</td>
      <td>...</td>
      <td>[Yes, NO, I don’t know Facebook Developer circ...</td>
      <td>[Bad, Not Bad, Good, Excellent]</td>
    </tr>
  </tbody>
</table>

## Output: :fast_forward:
### Preprocessed answers in CSV:

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>userId</th>
      <th>Talks_Participation_19_20</th>
      <th>lastSubmit</th>
      <th>Wanted_Programming_Languages</th>
      <th>...</th>
      <th>English_Barrier</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>01jKBLnYhGTy3xztjuhVIf2jass1</td>
      <td>0</td>
      <td>1603211692917</td>
      <td>[JavaScript]</td>
      <td>...</td>
      <td>No</td>
      <td>20 to 24 years</td>
    </tr>
    <tr>
      <th>1</th>
      <td>020TufnjwQTTT0C7jzE0BYz39j53</td>
      <td>NaN</td>
      <td>1604010020407</td>
      <td>NaN</td>
      <td>...</td>
      <td>Yes</td>
      <td>20 to 24 years</td>
    </tr>
    <tr>
      <th>2</th>
      <td>03RLF3jf97R8Hb49KJCOAWoipiB2</td>
      <td>0</td>
      <td>1603210798458</td>
      <td>[C#, TypeScript, Go]</td>
      <td>...</td>
      <td>No</td>
      <td>20 to 24 years</td>
    </tr>
    <tr>
      <th>3</th>
      <td>03iq2uFIwNOqgNw01FF2AViQr9B3</td>
      <td>NaN</td>
      <td>1603449369739</td>
      <td>NaN</td>
      <td>...</td>
      <td>No</td>
      <td>20 to 24 years</td>
    </tr>
  </tbody>
</table>

### Preprocessed questions in CSV:
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Gender</th>
      <th>Age</th>
      <th>Country</th>
      <th>...</th>
      <th>Moroccan_DevC_Membership</th>
      <th>Moroccan_Community_AutoEval</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>label</th>
      <td>What is your gender?</td>
      <td>What is your age?</td>
      <td>Where are you currently located?</td>
      <td>...</td>
      <td>Are you part of one of the Moroccan Facebook D...</td>
      <td>How do you evaluate the Moroccan Tech Community?</td>
    </tr>
    <tr>
      <th>required</th>
      <td>True</td>
      <td>True</td>
      <td>True</td>
      <td>...</td>
      <td>True</td>
      <td>True</td>
    </tr>
    <tr>
      <th>multiple</th>
      <td>False</td>
      <td>None</td>
      <td>None</td>
      <td>...</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>choices</th>
      <td>[Male, Female]</td>
      <td>[Younger than 15 years, 15 to 19 years, 20 to ...</td>
      <td>[Morocco, Europe, US, Others]</td>
      <td>...</td>
      <td>[Yes, NO, I don’t know Facebook Developer circ...</td>
      <td>[Bad, Not Bad, Good, Excellent]</td>
    </tr>
    <tr>
      <th>Survey_Code</th>
      <td>profile-q-0</td>
      <td>profile-q-1</td>
      <td>profile-q-2</td>
      <td>...</td>
      <td>community-q-6</td>
      <td>community-q-7</td>
    </tr>
  </tbody>
</table>
