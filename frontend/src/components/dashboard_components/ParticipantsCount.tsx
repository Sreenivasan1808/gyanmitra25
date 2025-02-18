import { useEffect, useState } from 'react'
import { getCollegeWiseParticipantCount } from '../../services/RegistrationSVC';

const ParticipantsCount = () => {
    const [collegeWiseData, setCollegeWiseData] = useState<any>();

    const fetchData = async () => {
        const status = await getCollegeWiseParticipantCount();
        if(status?.data){
            setCollegeWiseData(status.data);
        }
        
      };
      useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
          fetchData();
        }, 10000);
        return () => clearInterval(interval);
      }, []);
  return (
    <div>
      <table className="table-auto w-full mb-4 border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border w-fit">S.No</th>
            <th className="px-4 py-2 border min-w-full">College Name</th>
            
            <th className="px-4 py-2 border">Total Count</th>
          </tr>
        </thead>
        <tbody>
          {collegeWiseData &&
            collegeWiseData.map((college: any, index: number) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 min-w-fit">
                  {college.collegeName}
                </td>
                
                <td className="border px-4 py-2">
                  {college.count}
                </td>
                
              </tr>
            ))}
          <tr>
            <td></td>
            <td className="font-semibold border px-4 py-2 text-right">TOTAL</td>
            
            <td className="font-semibold border px-4 py-2">
              {collegeWiseData?.reduce((acc: any, curr:any) => acc + curr.count, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ParticipantsCount
