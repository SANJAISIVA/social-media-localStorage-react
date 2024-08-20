import { RiLoader2Line } from "react-icons/ri";
import { useContext } from "react"
import Feed from "./Feed"
import DataContext from "./context/DataContext"


const Home = (  ) => {

  const { searchResults, loading } = useContext(DataContext)

  return (
    <main className="Home">
        {loading && <p className="statusMsg">
          <RiLoader2Line className="loader"/> 
          <br />
            Loading posts...</p>
        } 
        
        {!loading && 
            ( searchResults.length ? 
                <Feed posts={searchResults} /> : 
                <p className="statusMsg">No posts to display.</p>
            )
        }
    </main>
  )
}

export default Home