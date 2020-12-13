import React from "react"
import { Link } from "gatsby"
import Popup from "reactjs-popup"

import CharIcon from "../../assets/Chart.svg"
import ShareIcon from "../../assets/Share.svg"
import Share from "../Share"

export const Actions = ({ id }) => (
  <div className="chart-actions">
    <Popup
      on="hover"
      trigger={
        <div className="item">
          <ShareIcon /> Share result
        </div>
      }
      position="top center"
      closeOnDocumentClick
    >
      <Share shareUrl={`https://stateofdev.ma/#${id}`} />
    </Popup>
    <Link className="item" to={`/playground/#question=${id}`} target="_blank">
      <CharIcon /> Open in playground
    </Link>
  </div>
)
