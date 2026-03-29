'use client'

export default function MockArticleBody({ blocks }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === 'p') {
          return <p key={idx}>{block.text}</p>
        }
        if (block.type === 'h2') {
          return <h2 key={idx}>{block.text}</h2>
        }
        if (block.type === 'blockquote') {
          return (
            <blockquote key={idx}>
              <p>{block.text}</p>
            </blockquote>
          )
        }
        if (block.type === 'stat') {
          return (
            <div key={idx} className='stat-box'>
              <div className='stat-number'>{block.number}</div>
              <div className='stat-text'>{block.text}</div>
            </div>
          )
        }
        return null
      })}
    </>
  )
}
