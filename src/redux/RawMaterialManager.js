import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRawMaterial, updateRawMaterial, deleteRawMaterial } from './reducers/rawMaterialSlice';

const RawMaterialManager = () => {
  const dispatch = useDispatch();
  const rawMaterials = useSelector((state) => state.rawMaterials.rawMaterials);

  const [newMaterial, setNewMaterial] = useState({ id: '', name: '' });
  const [updateMaterial, setUpdateMaterial] = useState({ id: '', name: ''});

  const handleAddMaterial = () => {
    dispatch(addRawMaterial(newMaterial));
    setNewMaterial({ id: '', name: ''});
  };

  const handleUpdateMaterial = () => {
    dispatch(updateRawMaterial(updateMaterial));
    setUpdateMaterial({ id: '', name: ''});
  };

  const handleDeleteMaterial = (id) => {
    dispatch(deleteRawMaterial({ id }));
  };

  return (
    <div>
      <h1>Raw Material Manager</h1>
      
      <h2>Add Raw Material</h2>
      <input
        type="text"
        placeholder="ID"
        value={newMaterial.id}
        onChange={(e) => setNewMaterial({ ...newMaterial, id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Name"
        value={newMaterial.name}
        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
      />
     
      <button onClick={handleAddMaterial}>Add Material</button>
      
      <h2>Update Raw Material</h2>
      <input
        type="text"
        placeholder="ID"
        value={updateMaterial.id}
        onChange={(e) => setUpdateMaterial({ ...updateMaterial, id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Name"
        value={updateMaterial.name}
        onChange={(e) => setUpdateMaterial({ ...updateMaterial, name: e.target.value })}
      />
      
      <button onClick={handleUpdateMaterial}>Update Material</button>

      <h2>Raw Materials</h2>
      <ul>
        {rawMaterials.map((material) => (
          <li key={material.id}>
            {material.name} 
            <button onClick={() => handleDeleteMaterial(material.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RawMaterialManager;
