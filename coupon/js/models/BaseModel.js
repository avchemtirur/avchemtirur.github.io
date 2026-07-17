/**

BaseModel - Abstract base class for all data models

Provides common functionality like validation, serialization, defaults
*/


class BaseModel {
constructor(data = {}) {
this.id = data.id || null;
this.createdAt = data.createdAt || new Date().toISOString();
this.updatedAt = data.updatedAt || new Date().toISOString();
this.version = data.version || 1;
this.deleted = data.deleted || false;
}

/**

Convert model to plain object
*/
toJSON() {
return { ...this };
}


/**

Convert plain object to model
*/
static fromJSON(data) {
return new this(data);
}


/**

Get required fields for validation
*/
static getRequiredFields() {
return [];
}


/**

Validate model data
*/
validate() {
const errors = {};
const required = this.constructor.getRequiredFields();


required.forEach(field => {  
  if (!this[field]) {  
    errors[field] = `${field} is required`;  
  }  
});  

return {  
  isValid: Object.keys(errors).length === 0,  
  errors  
};

}

/**

Clone model
*/
clone() {
return new this.constructor(this.toJSON());
}


/**

Check equality
*/
equals(other) {
return JSON.stringify(this) === JSON.stringify(other);
}


/**

Get changed fields compared to another instance
*/
getChanges(other) {
const changes = {};
Object.keys(this).forEach(key => {
if (this[key] !== other[key]) {
changes[key] = {
from: other[key],
to: this[key]
};
}
});
return changes;
}
}