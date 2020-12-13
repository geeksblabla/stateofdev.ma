import React from "react"
import { Link } from "gatsby"
import Popup from "reactjs-popup"
import { useLocation } from "@reach/router"

import CharIcon from "../../assets/Chart.svg"
import ShareIcon from "../../assets/Share.svg"
import Share from "../Share"

export const Actions = ({ id }) => {
  const location = useLocation()

  return (
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
        <Share
          shareUrl={
            location.pathname !== "/playground/"
              ? `https://stateofdev.ma/#${id}`
              : location.href
          }
        />
      </Popup>
      {location.pathname !== "/playground/" ? (
        <Link
          className="item"
          to={`/playground/#question=${id}`}
          target="_blank"
        >
          <CharIcon /> Open in playground
        </Link>
      ) : null}
    </div>
  )
}
