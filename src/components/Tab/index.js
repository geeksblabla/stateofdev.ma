import React from "react"
import { Tab, Tabs as NTabs, TabList, TabPanel } from "react-tabs"
import "./index.scss"

export default () => (
  <NTabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </NTabs>
)

export const Tabs = ({ children }) => {
  const titles = children.map(child => child.props.title)
  const chs = children.map(child => child.props.children)
  return (
    <NTabs>
      <TabList>
        {titles.map(t => (
          <Tab>{t}</Tab>
        ))}
      </TabList>
      {chs.map(child => (
        <TabPanel>{child}</TabPanel>
      ))}
    </NTabs>
  )
}

export const TabItem = () => {
  return null
}
