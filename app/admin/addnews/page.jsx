'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Page = () => {
  const [locked, setLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "India",
    author: ""
  });
  const [subheadings, setSubheadings] = useState([{ heading: "", subdescription: "", image: null }]);

  const unlockForm = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setLocked(false);
    } else {
      toast.error("Incorrect password");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubheadingChange = (index, event) => {
    const { name, value } = event.target;
    const newsubheadings = [...subheadings];
    newsubheadings[index][name] = value;
    setSubheadings(newsubheadings);
  };

  const handleSubImageChange = (index, event) => {
    const file = event.target.files[0];
    const newsubheadings = [...subheadings];
    newsubheadings[index].image = file;
    setSubheadings(newsubheadings);
  };

  const addSubheading = () => {
    setSubheadings([...subheadings, { heading: "", subdescription: "", image: null }]);
  };

  const deleteSubheading = (index) => {
    const newsubheadings = subheadings.filter((_, i) => i !== index);
    setSubheadings(newsubheadings);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('image', image);

    subheadings.forEach((subheading, index) => {
      formData.append(`subheadings[${index}][heading]`, subheading.heading);
      formData.append(`subheadings[${index}][subdescription]`, subheading.subdescription);
      if (subheading.image) {
        formData.append(`subheadings[${index}][image]`, subheading.image);
      }
    });

    try {
      const response = await axios.post('/api/news', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(false);
        setData({
          title: "",
          description: "",
          category: "India",
          author: ""
        });
        setSubheadings([{ heading: "", subdescription: "", image: null }]);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error submitting the form");
    }
  };

  if (locked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Password</h2>
          <form onSubmit={unlockForm} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter password"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Upload News</h2>
        <button 
          onClick={() => setLocked(true)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Lock Form
        </button>
      </div>
      <form onSubmit={onSubmitHandler} className='mt-6 space-y-6'>

        {/* Thumbnail Upload */}
        <label className='block text-lg font-medium text-gray-700'>Upload Thumbnail</label>
        <label htmlFor="image" className='cursor-pointer'>
          <Image className='mt-2 rounded-lg' src={!image ? assets.upload_area : URL.createObjectURL(image)} width={140} height={70} alt='' />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />

        {/* Title */}
        <div>
          <label className='block text-lg font-medium text-gray-700'>News Title</label>
          <input name='title' onChange={onChangeHandler} value={data.title} className='w-full mt-2 px-4 py-2 border rounded-md' type="text" placeholder='Type here' required />
        </div>

        {/* Author Name */}
        <div>
          <label className='block text-lg font-medium text-gray-700'>Author Name</label>
          <input name='author' onChange={onChangeHandler} value={data.author} className='w-full mt-2 px-4 py-2 border rounded-md' type="text" placeholder='Author name' required />
        </div>

        {/* Description */}
        <div>
          <label className='block text-lg font-medium text-gray-700'>News Description</label>
          <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full mt-2 px-4 py-2 border rounded-md' placeholder='Write content here' rows={6} required />
        </div>

        {/* Subheadings */}
        {subheadings.map((subheading, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-50">
            <label className='block text-lg font-medium text-gray-700'>Subheading {index + 1}</label>
            <input name="heading" value={subheading.heading} onChange={(e) => handleSubheadingChange(index, e)} className='w-full mt-2 px-4 py-2 border rounded-md' type="text" placeholder='Subheading' required />

            <label className='block text-lg font-medium text-gray-700 mt-4'>Subdescription</label>
            <textarea name="subdescription" value={subheading.subdescription} onChange={(e) => handleSubheadingChange(index, e)} className='w-full mt-2 px-4 py-2 border rounded-md' placeholder='Write subdescription here' rows={4} required />

            <label className='block text-lg font-medium text-gray-700 mt-4'>Subheading Image (Optional)</label>
            <input type="file" onChange={(e) => handleSubImageChange(index, e)} className='mt-2' />

            <button type="button" onClick={() => deleteSubheading(index)} className='mt-4 px-4 py-2 bg-red-500 text-white rounded-md'>Delete</button>
          </div>
        ))}

        <button type="button" onClick={addSubheading} className='w-full py-2 bg-blue-500 text-white rounded-md'>Add Subheading</button>

        {/* Category */}
        <label className='block text-lg font-medium text-gray-700'>News Category</label>
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-full px-4 py-2 border rounded-md text-gray-700'>
          <option value="Trending">Trending</option>
          <option value="India">India</option>
          <option value="Politics">Politics</option>
          <option value="International">International</option>
          <option value="Health">Health</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Sports">Sports</option>
          <option value="Science">Science</option>
          <option value="Social">Social</option>
          <option value="Video">Video</option>
          <option value="Podcast">Podcast</option>
        </select>

        <button type="submit" className='w-full py-2 bg-black text-white rounded-md'>ADD</button>
      </form>
    </div>
  );
};

export default Page;