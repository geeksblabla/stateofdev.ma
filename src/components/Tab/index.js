import React from "react"
import { Tab, Tabs as NTabs, TabList, TabPanel } from "react-tabs"
import "./index.scss"

export const Tabs = ({ children }) => {
  const titles = children.map(child => child.props.title)
  const chs = children.map(child => child.props.children)
  return (
    <NTabs>
      <TabList>
        {titles.map((t, i) => (
          <Tab key={`tab-${i}`}>{t}</Tab>
        ))}
      </TabList>
      {chs.map((child, i) => (
        <TabPanel key={`tab-content-${i}`}>{child}</TabPanel>
      ))}
    </NTabs>
  )
}

export const TabItem = () => {
  return null
}
