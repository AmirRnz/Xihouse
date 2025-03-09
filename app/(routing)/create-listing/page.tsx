"use client";
import React, { useState } from "react";
import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'

const CreateListing = () => {
  const router = useRouter();
  const {isSignedIn, user, isLoaded} = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    type: 'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,

  });
  console.log(formData)
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).than((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false)
        setUploading(false)
      })
      .catch((err)=>{
        setImageUploadError('image upload failed(2mb per image')
        setUploading(false)
      })
    }else{
      setImageUploadError('you can only upload 6 images')
      setUploading(false)
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storageRef,file);
      uploadTask.on('state_changed',(snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
        console.log(`upload is ${progress} % done`)
      },(error){
        reject(error)
      },
      ()=>{
        getDownloadUrl(uploadTask.snapshot.ref).then((downloadUrl)=>{
          resolve(downloadUrl)
        })
      }
    ), 
    });
  };
  const handleRemoveImage = (index) =>{
    setFormData|({
      ...formData,
      imageUrls: formData.imageUrls.filter((_,i)=> i !== index)
    })
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]:value
    }));
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      if(formData.imageUrls.length < 1) {
        return setError('you must upload at least one image')
      }
      if(+formData.reqularPrice < +formData.discountPrice){
        return setError('discount price must be lower than regular price')
      }
      setLoading(true)
      setError(false)
      const res = await fetch('/api/listing/create',{
        method:'POST',
        headers:{
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMongoId,
        })
      })
      const data = await res.json();
      setLoading(false)
      console.log(data,"must be checked ")
      if(data.success===false){
        setError(data.message)
      }
      router.push(`/listing/${data._id}`)
    }catch(error){
      setError(error.message)
      setLoading(false)
    }

  }
  if (!isLoaded) {
    return (
      <h1 className='text-center text-xl my-7 font-semibold'>Loading...</h1>
    );
  }
  if (!isSignedIn) {
    return (
      <h1 className='text-center text-xl my-7 font-semibold'>
        You are not authorized to view this page
      </h1>
    );
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Name"
            name='name'
            id="name"
            maxLength={62}
            minLength={10}
            required={true}
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className="border p-3 rounded-lg"
            placeholder="Description"
            name='description'
            id="description"
            required={true}
            onChange={handleChange}
            value={formData.description}
          />
          <input
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Address"
            name='address'
            id="address"
            required={true}
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"             onChange={handleChange}
              name='sale'
              checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" 
              onChange={handleChange}
              name='rent'
              checked={formData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"
              onChange={handleChange}
              name='parking'
              checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" 
              onChange={handleChange}
              name='furnished'
              checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" 
              onChange={handleChange}
              name='offer'
              checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                name='bedrooms'
                min={0}
                max={10}
                required={true}
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                name='bathrooms'
                min={0}
                max={10}
                required={true}
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                required={true}
                min={50}
                name='regularPrice'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span>($/month)</span>
              </div>
            </div>
            {formData.offer &&             
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                required={true}
                min={0}
                name='discountPrice'
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span>($/month)</span>
              </div>
            </div> }

          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple={true}
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <button
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
            {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white  rounded-lg uppercase hover:opacity-95 disabled:opacity-80" disabled={loading||uploading}>
            {loading ? 'creating...': 'Create Lising'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;

