import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

const BlogTags = ({selectedTags, tagsList}) => {
  const router = useRouter()

  const capitalizeFirstLetter = tag => tag.charAt(0).toUpperCase() + tag.slice(1)

  const addTag = tag => {
    if (!selectedTags.includes(tag.slug)) {
      router.push(`/blog?tags=${[...selectedTags, tag.slug]}`)
    }
  }

  const removeTag = tag => {
    if (selectedTags.length === 1) {
      resetTags()
    } else {
      router.push(`/blog?tags=${selectedTags.filter(t => t !== tag)}`)
    }
  }

  const resetTags = () => {
    router.push('/blog')
  }

  return (
    <div className='tags-container'>
      <h2 className='fr-h6 fr-m-0'>Filtrer par tags</h2>

      <div className='tags-list'>
        {tagsList.map(tag => (
          <button
            onClick={() => addTag(tag)}
            type='button'
            key={tag.slug}
            className={`fr-tag ${selectedTags.includes(tag.slug) ? 'selected' : ''}`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className='tags-list'>
        {selectedTags.map(tag => (
          <button
            type='button'
            onClick={() => removeTag(tag)}
            key={tag.slug}
            className='fr-tag fr-icon-close-line fr-tag--icon-left'
          >
            {capitalizeFirstLetter(tag)}
          </button>
        ))}
      </div>

      <style jsx>{`
        .tags-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 1em;
        }

        .tags-list {
          display: flex;
          gap: 10px;
        }

        .selected {
          opacity: 50%;
        }
      `}</style>
    </div>
  )
}

BlogTags.propTypes = {
  selectedTags: PropTypes.array.isRequired,
  tagsList: PropTypes.array.isRequired
}

export default BlogTags
