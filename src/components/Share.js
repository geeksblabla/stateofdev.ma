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
        <FacebookIcon size={30} />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl}>
        <TwitterIcon size={30} />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} windowWidth={750} windowHeight={600}>
        <LinkedinIcon size={30} />
      </LinkedinShareButton>
      <WhatsappShareButton url={shareUrl} separator=":: ">
        <WhatsappIcon size={30} />
      </WhatsappShareButton>
    </div>
  )
}
