import './VoterDetail.css';
import { useParams } from 'react-router-dom';

function VoterDetail() {

    const { ncid } = useParams();

    return(
    <div>
        <h1>Firstname Lastname</h1>

        NCID: {ncid}
        <div className="adjacent-tables">
            <div>
                <h2>Primaries Voting History</h2>
            </div>
            <div>
                <h2>Voting Registration History</h2>
            </div>
        </div>
    </div>
    );
}

export default VoterDetail;