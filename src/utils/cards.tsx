import React, { useRef } from 'react'
import { useDrop, useDrag, DropTargetMonitor, XYCoord } from 'react-dnd'

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundBolor: "white",
    cursor: "move",
    transition: "all 0.3s"
}
interface CardOptions {
    id: number,
    text: string,
    index: number,
    moveCard: (dragIndex: number, hoverIndex: number) => void,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

export default function Card({ id, text, index, moveCard }: CardOptions) {
    const ref = useRef<HTMLDivElement>(null)
    const [{ isDragging }, drag] = useDrag({
        item: { type: "Card", id, index },
        collect: (mointor: any) => ({
            isDragging: mointor.isDragging()
        })
    })

    const [, drop] = useDrop({
        accept: "Card",
        hover: (item: DragItem, mointor: DropTargetMonitor) => {
            // 这里必须加上DragItem这个范围限制，不然访问不到属性
            // console.log('dragIndex',item.index)

            if (!ref.current) {
                return
            }

            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) {
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            if (hoverBoundingRect) {
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
                const clientOffSet = mointor.getClientOffset()
                const hoverClientY = (clientOffSet as XYCoord).y - hoverBoundingRect.top

                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return
                }

                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return
                }

                moveCard(dragIndex, hoverIndex)
                item.index = hoverIndex
            }
        }
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <div
            ref={ref}
            style={{ ...style, opacity }}
        >
            {text}
        </div>
    )
}
