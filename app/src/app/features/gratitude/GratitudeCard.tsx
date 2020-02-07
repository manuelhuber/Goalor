import PopupImage from "app/common/PopupImage";
import PopupMenu from "app/common/PopupMenu";
import {PaddedDiv} from "app/common/StyledComponents";
import {deleteGratitude} from "app/features/gratitude/duck";
import {AppState} from "app/Store";
import {Gratitude} from "generated/models";
import React from "react";
import {MdDelete, MdEdit} from "react-icons/all";
import {connect} from "react-redux";
import {device} from "style/styleConstants";
import styled from "styled-components";
import {bindActions} from "util/duckUtil";

const mapStateToProps = (state: AppState, props: { gratitude: Gratitude, onEdit?: () => void }) => props;
const mapDispatchToProps = bindActions({deleteGratitude});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const GratitudeCard: React.FC<Props> = props => {
    const {id, date, description, title, image} = props.gratitude;
    const deleteIt = () => props.deleteGratitude(id);
    return <Root>
        {image &&
        <ImageWrapper>
            <PopupImage src={`${process.env.REACT_APP_BASE_URL}/image/${image}`}/>
        </ImageWrapper>}
        <Content>
            <HeaderRow>
                <Info>
                    <Date>{date.toLocaleDateString()}</Date>
                    <PopupMenu entries={[
                        {icon: MdDelete, text: "Delete", onClick: deleteIt},
                        {icon: MdEdit, text: "Edit", onClick: props.onEdit}
                    ]}/>
                </Info>
                <Title>{title}</Title>
            </HeaderRow>
            <PaddedDiv>{description}</PaddedDiv>
        </Content>
    </Root>;
};

const Root = styled.div`
    display: flex;
    border: 2px solid var(--color-neutral-tint2);
    border-radius: var(--border-radius);
    box-shadow: 0 0 4px 1px var(--color-neutral-tint4);
`;
const ImageWrapper = styled.div`
    flex-basis: 150px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
`;
const Content = styled.div`
    flex-grow: 1;
`;
const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    @media ${device.screenMd} {
        flex-direction: row-reverse;
    }
`;
const Title = styled(PaddedDiv)`
    font-weight: bold;
`;
const Info = styled.div`
    align-self: flex-end;
    @media ${device.screenMd} {
        align-self: flex-start;
    }
    display: flex;
    align-items: center;
`;
const Date = styled(PaddedDiv)`
    color: var(--color-neutral-tint2);
`;

export default connect(mapStateToProps, mapDispatchToProps)(GratitudeCard);
