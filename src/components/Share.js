import React from "react"
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share"

export default ({ shareUrl, title: t }) => {
  const title = "I just completed 'State of Dev in Morocco' survey"

  return (
    <div className="share-buttons">
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={40} />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={40} />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} windowWidth={750} windowHeight={600}>
        <LinkedinIcon size={40} />
      </LinkedinShareButton>
      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
        <WhatsappIcon size={40} />
      </WhatsappShareButton>
    </div>
  )
}
