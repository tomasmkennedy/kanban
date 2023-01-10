import React from 'react';
import './App.css';

export const Form = ({ onSubmit, sDesc, sName }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Task Name</label>
        <input className="form-control" id="name" maxLength="18" defaultValue={sName} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Task Description</label>
        <input
          type="description"
          className="form-control"
          id="description"
          maxLength="84"
          defaultValue={sDesc}
        />
      </div>
      <div className="form-group-button">
        <button className="form-control btn btn-primary" type="submit">
          Submit
          </button>
      </div>
    </form>
  );
};
export default Form;