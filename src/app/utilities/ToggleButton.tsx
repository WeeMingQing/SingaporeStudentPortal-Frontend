import React, {useState} from "react"
import './ToggleButton.css'
import cx from "classnames"

type ToggleButtonProps = {
    rounded: boolean
    isToggled: boolean
    onToggle: () => void
}

export function ToggleButton({rounded, isToggled, onToggle}: ToggleButtonProps) {
    const str = rounded ? "rounded" : ""
    const sliderCX = cx("slider", str)
    return (
        <label className="switch">
            <input type="checkbox" checked={isToggled} onChange={onToggle}/>
            <span className={sliderCX}/>
        </label>
    )
}