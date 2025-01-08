import {useEffect} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors.js'

const Post = ({baseUrl, title, html}) => {
  useEffect(() => {
    const audioPlayers = [...document.querySelectorAll('audio')]
    const videoPlayers = [...document.querySelectorAll('video')]

    // Add controls to Vidéo player
    if (videoPlayers.length > 0) {
      videoPlayers.forEach(v => {
        v.setAttribute('controls', true)
      })
    }

    // Add controls to Audio player
    if (audioPlayers.length > 0) {
      audioPlayers.forEach(a => {
        a.setAttribute('controls', true)
      })
    }
  }, [])

  return (
    <div className='blog fr-my-5w fr-mx-3w fr-mx-md-15w'>
      <div className='fr-pb-5w'>
        <Link legacyBehavior href={baseUrl}>
          <a className='fr-link fr-fi-arrow-left-line fr-link--icon-left'>
            Retournez à la liste des articles
          </a>
        </Link>

        <h2 className='fr-my-5w'>{title}</h2>
        {/* Pas d'auteurs dans le fichier JSON */}
        {/* <div className='authors-container'> */}
        {/*   {authors.length === 1 && ( */}
        {/*     <Image */}
        {/*       src={authors[0].profile_image || '/images/illustrations/user-fallback.svg'} */}
        {/*       height={50} */}
        {/*       width={50} */}
        {/*       style={{ */}
        {/*         width: '50px', */}
        {/*         height: '50px', */}
        {/*         objectFit: 'contain', */}
        {/*         borderRadius: '50%', */}
        {/*         border: 'solid .5px grey' */}
        {/*       }} */}
        {/*       alt='' */}
        {/*       aria-hidden='true' */}
        {/*     /> */}
        {/*   )} */}
        {/*   <div> */}
        {/*     <div className='names'> */}
        {/*       {authors.map(author => <span key={author.id}>{author.name} </span>)} */}
        {/*     </div> */}
        {/*     <div className='date'>Publié le {shortDate(published_at)} - {reading_time} min de lecture</div> */}
        {/*   </div> */}
        {/* </div> */}
      </div>

      <div dangerouslySetInnerHTML={{__html: html}} /* eslint-disable-line react/no-danger */ />

      <Link legacyBehavior href={baseUrl}>
        <a className='fr-link fr-fi-arrow-left-line fr-link--icon-left'>
          Retourner à la liste des articles
        </a>
      </Link>

      <style jsx global>{`
        .blog-feature-image-container {
          position: relative;
          height: 250px;
          box-shadow: 38px 24px 50px -21px lightGrey;
        }

        .names {
          font-weight: bold;
        }

        .date {
          font-style: italic;
        }

        .authors-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 1em;
        }

        .kg-card, .kg-image-card, .kg-card-hascaption {
          border-radius: 8px;
          margin-top: 1em;
        }

        p img {
          width: 100%;
        }

        .kg-image-card img,
        .kg-product-card img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 38px 24px 50px -21px #C9D3DF;
        }

        .blog-image,
        .blog-feature-image {
          border-radius: 4px;
        }

        .blog-separator {
          border-bottom: 1px solid #0053B3;
          padding: .5em;
        }

        .blog-back-button {
          vertical-align: middle;
          padding: .5em 1em;
        }

        .blog figcaption {
          font-style: italic;
          margin-bottom: 2em;
        }

        .blog figure.kg-card {
          text-align: center;
        }

        .infos-container {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #0053B3;
        }

        .blog li {
          list-style-type: disc;
        }

      {/***** Callout Block *****/}

        .kg-callout-card {
          width: 100%;
          display: flex;
          align-items: center;
          font-weight: bold;
          padding: 1.2em;
          border-radius: 3px;
          font-size: 1.2rem;
          margin: 2em auto;
          background: ${colors.info950};
        }

        .kg-callout-emoji {
          margin-right: .5em;
        }

      {/***** Bookmark Block *****/}

        .kg-bookmark-card {
          position: relative;
          width: 100%;
          margin: 1em auto;
        }

        .kg-bookmark-card a.kg-bookmark-container {
          display: flex;
          text-decoration: none;
          border-radius: 3px;
          border: 1px solid rgb(124 139 154/25%);
          overflow: hidden;
          color: inherit;
          text-align: left;
        }

        .kg-bookmark-content {
          display: flex;
          flex-direction: column;
          padding: 1em;
          margin-right: 1em;
          overflow: hidden;
          flex-grow: 1;
          flex-basis: 100%;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .kg-bookmark-thumbnail {
          position: relative;
          flex-grow: 1;
          min-width: 33%;
        }

        .kg-bookmark-title {
          color: #111;
          font-size: 1.1em;
          line-height: 1.1em;
          font-weight: 400;
        }

        .kg-bookmark-description {
          margin-top: 3px;
          font-size: 14px;
          max-height: 55px;
          opacity: .7;
          overflow: hidden;
        }

        .kg-bookmark-metadata {
          display: flex;
          align-items: center;
          margin-top: 22px;
          width: 100%;
          font-weight: 500;
          white-space: nowrap;
        }

        .kg-bookmark-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }

        .kg-bookmark-author {
          padding-right: .5em;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .kg-bookmark-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 0 2px 2px 0;
        }

      {/***** Gallery Block *****/}

        .kg-gallery-row {
          contain: content;
          grid-gap: .5em;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          align-items: flex-end;
        }

        .kg-gallery-image img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 3px;
          margin: auto;
        }

      {/***** Button Block *****/}

        .kg-align-center {
          text-align: center;
        }

        .kg-button-card a {
          color: white;
          border-radius: 5px;
          font-weight: 1em;
          padding: .5em 1.2em;
          height: 2.4em;
          line-height: 1em;
          margin: auto;
          text-decoration: none;
          transition: all .2s ease;
        }

      {/***** Blockquote *****/}

        .blog blockquote {
          font-style: italic;
          border-left: 1px solid ${colors.info200};
          padding-left: 1em;
        }

      {/***** Toggle Block *****/}

        .kg-toggle-card {
          background: 0 0;
          box-shadow: inset 0 0 0 1px rgba(124,139,154,.25);
          border-radius: 4px;
          padding: 1.2em;
          margin-bottom: .5em;
          border: solid 2px ${colors.info425};
        }

        .kg-toggle-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .kg-toggle-heading h4 {
          margin-bottom: 0;
        }

        button.kg-toggle-card-icon {
          background-color: white;
          border: none;
          fill: ${colors.info425};
        }

        .toggled {
          transform: rotate(180deg);
        }

        .kg-toggle-content {
          height: auto;
          opacity: 1;
          transition: opacity 1s ease,top .35s ease;
          top: 0;
          position: relative;
        }

        .kg-toggle-card[data-kg-toggle-state="close"] .kg-toggle-content {
          height: 0;
          overflow: hidden;
          transition: opacity .5s ease,top .35s ease;
          opacity: 0;
          top: -.5em;
          position: relative;
        }

      {/***** Video Block *****/}

        .kg-video-container video {
          width: 100%;
          height: 100%;
        }

      {/***** Audio Block *****/}

        .kg-audio-card {
          display: flex;
          width: 100%;
          padding: .5em;
          margin-bottom: 1em;
          min-height: 96px;
          border-radius: 3px;
          box-shadow: inset 0 0 0 1px rgba(124,139,154,.25);
        }

        .kg-audio-player-container {
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
        }

        .kg-audio-player-container audio {
          width: 100%;
          border-radius: 5px;
        }

      {/***** File Block *****/}

        .kg-file-card-container {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          padding: 6px;
          border: 1px solid rgb(124 139 154/25%);
          border-radius: 3px;
          transition: all ease-in-out .35s;
          text-decoration: none;
          width: 100%;
          margin-bottom: 1em;
        }

        .kg-file-card-contents {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 4px 8px;
          width: 100%;
        }

        .kg-file-card-metadata {
          display: flex;
          margin-top: 2px;
          padding: 0 0 .5em .5em;
          font-style: italic;
        }

        .kg-file-card-filesize {
          margin-left: 1em;
        }

        .kg-file-card-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          min-width: 80px;
        }

      {/***** Header Block *****/}

        .kg-header-card {
          padding: 4em ;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          background: ${colors.info425};
          color: white;
          margin: 1em -7.5rem;
          border-radius: 0;
          background-position: center;
        }

        .kg-header-card h2 {
          font-size: 3em;
        }

        .kg-header-card h2, .kg-header-card h3 {
          color: white;
        }

        .kg-header-card-button {
          width: fit-content;
          align-self: center;
        }

      {/***** Product Block *****/}

        .kg-product-card {
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
        }

        .kg-product-card-container {
          align-items: center;
          background: 0 0;
          max-width: 550px;
          padding: 20px;
          border-radius: 5px;
          box-shadow: inset 0 0 0 1px rgb(124 139 154/25%);
          margin-bottom: 1em;
        }

      {/***** Card Titles *****/}

        .kg-audio-title,
        .kg-file-card-title {
          color: #111;
          font-size: 1.3em;
          line-height: 1.1em;
          font-weight: 600;
          padding: .5em;
        }

      {/***** Hidden Elements *****/}

        .kg-audio-player,
        .kg-audio-thumbnail,
        .kg-video-overlay,
        .kg-video-large-play-icon,
        .kg-video-player,
        .kg-video-player-container,
        .kg-video-play-icon svg {
          display: none;
        }

      {/***** Icons *****/}

        .kg-toggle-card-icon svg,
        .kg-file-card-icon svg {
          height: 24px;
          width: 24px;
        }

        {/***** Rating *****/}

        .kg-product-card-rating {
          display: flex
        }

        .kg-product-card-rating span {
          width: 20px;
        }

        .kg-product-card-rating-active.kg-product-card-rating-star svg {
          fill: ${colors.info425};
        }

        .kg-product-card-rating-star svg {
          fill: ${colors.grey850};
        }

        {/* Button */}

        .kg-btn {
          background: ${colors.info425};
        }
      `}</style>
    </div>
  )
}

Post.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  html: PropTypes.node.isRequired
}

export default Post
