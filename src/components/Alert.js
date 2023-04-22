import React from 'react'

export default function Alert(props) {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    props.alert && <div>
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
            <strong>{capitalizeFirstLetter(props.alert.type === "danger" ? "Error": props.alert.type)}:</strong> {props.alert.msg}
        </div>
    </div>
  )
}