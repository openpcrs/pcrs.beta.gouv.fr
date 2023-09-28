import Loader from './loader.js'

const CenteredSpinnder = () => (
  <div className='loading-container'>
    <Loader />

    <style jsx>{`
        .loading-container {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        `}</style>
  </div>
)

export default CenteredSpinnder
