/**
 * filename: List
 * overview: 用来存放下方 Card 列表的 List 组件
 */

import update from "immutability-helper";
import React, { CSSProperties, useCallback } from "react";
import { useDrop } from "react-dnd";
import Card from './Card';

const style: CSSProperties = {
    backgroundColor: "white",
    border: "1px dashed gray",
    margin: "100px auto",
    minHeight: "300px",
    padding: "0 10px",
    textAlign: "center",
    width: 300,
};

export interface IListProps {
    cardList: any[];
    changeCardList: (list: any[]) => void;
}

const List: React.FC<IListProps> = ({ cardList, changeCardList }) => {
    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            {
                const dragCard = cardList[dragIndex];
                changeCardList(
                    update(cardList, {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    })
                );
            }
        }, [cardList]
    );
    return (
        <div style={style}>
            <p>{JSON.stringify(cardList)}</p>
            {(
                cardList.map((item: any, order: number) => (
                    <Card order={order} key={item.id} moveCard={moveCard} {...item} />
                ))
            )}
        </div>
    );
};

export default List;
