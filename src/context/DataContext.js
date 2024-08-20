import { createContext, useState, useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [posts, setPosts] = useState(
        // [
          // {
          //   id:1,
          //   title: "My 1st post",
          //   datetime: "July 01, 2024 11:17:32 AM",
          //   body: "Made a video about coc"
          // }
        // ]
    
        JSON.parse(localStorage.getItem("social-media-post")) || []
    
      )
      const [ search, setSearch ] =  useState('');
      const [ searchResults, setSearchResults ] = useState([]);
      const [ postTitle, setPostTitle ] = useState('');
      const [ postBody, setPostBody ] = useState('');
      const { width } = useWindowSize()
      // using custom hook useWindowSize to vary the icons for various window sizes     
      const [loading, setLoading] = useState(true);
    
       // Load posts from local storage when the app first loads
       useEffect(() => {
        const loadPosts = () => {
          const storedPosts = JSON.parse(localStorage.getItem('social-media-post'));
          if (storedPosts) {
            setPosts(storedPosts); 
          }
          setLoading(false);
        }
        const timeoutId = setTimeout(loadPosts, 1000);

        return () => {
          clearTimeout(timeoutId);
        };
      }, []);


      
      useEffect( () =>{

        const filteredResults = posts.filter( (post) => (
          ( (post.title).toLowerCase().includes(search.toLowerCase()) ) ||
          ( (post.body).toLowerCase().includes(search.toLowerCase()) )
         ) )
    
        setSearchResults(filteredResults.reverse())
      }, [posts, search] )
    
    
      const navigate = useNavigate();
    
      const handleSubmit = (event) => {
        event.preventDefault();
              
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1; 
        
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };    

        const allPosts = [...posts, newPost];
        setPosts(allPosts);
        localStorage.setItem("social-media-post", JSON.stringify(allPosts))
        setPostTitle('');
        setPostBody('');
        navigate('/'); // after insertion go back to home
       
      }
      
      const handleDelete = (id) => {

          const postList = posts.filter( (post) => post.id !== id);
          setPosts(postList);
          localStorage.setItem("social-media-post", JSON.stringify(postList))
          console.log("deleted");   
          navigate('/');
      }
    
      // Edit post
      const [editTitle, setEditTitle] = useState('');
      const [editBody, setEditBody] = useState('');
    
      const handleEdit = (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };

        const storedPosts = JSON.parse(localStorage.getItem("social-media-post")) || [];

        const updatedPosts = storedPosts.map((post) => (post.id === id ? updatedPost : post));

        localStorage.setItem("social-media-post", JSON.stringify(updatedPosts.reverse()));

        setEditTitle('')
        setEditBody('')
        navigate('/');
         
        setPosts(...posts, updatedPost);
        console.log(updatedPost);
        
        setEditTitle('');
        setEditBody('');
      }
    

    return (
        <DataContext.Provider value={{
            width, search, setSearch,
            searchResults,
            posts, setPosts, 
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            handleDelete,
            handleEdit, editTitle,setEditTitle,editBody,setEditBody,
            loading
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;