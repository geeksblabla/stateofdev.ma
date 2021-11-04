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
  return (
    <div className="share-buttons">
      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={40} />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl}>
        <TwitterIcon size={40} />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} windowWidth={750} windowHeight={600}>
        <LinkedinIcon size={40} />
      </LinkedinShareButton>
      <WhatsappShareButton url={shareUrl} separator=":: ">
        <WhatsappIcon size={40} />
      </WhatsappShareButton>
    </div>
  )
}
