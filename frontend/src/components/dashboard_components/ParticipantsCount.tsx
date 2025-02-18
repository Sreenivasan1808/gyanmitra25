import { useEffect, useState } from 'react'
import { getCollegeWiseParticipantCount } from '../../services/RegistrationSVC';

const ParticipantsCount = () => {
    const [collegeWiseData, setCollegeWiseData] = useState<any>();

    const fetchData = async () => {
        const status = await getCollegeWiseParticipantCount();
        console.log(status)
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
    <div className='p-8'>
        <h1 className='text-lg text-center m-4 font-semibold'>College Wise Count</h1>
      <table className="table-auto w-full mb-4 border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-2 bg-secondary-400 w-fit">S.No</th>
            <th className="px-4 py-2 border-2 bg-secondary-400 min-w-full">College Name</th>
            
            <th className="px-4 py-2 border-2 bg-secondary-400">Total Count</th>
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
                  {college.participantCount}
                </td>
                
              </tr>
            ))}
          <tr className='bg-secondary-400'>
            <td></td>
            <td className="font-semibold border px-4 py-2 text-right">TOTAL</td>
            
            <td className="font-semibold border px-4 py-2">
              {collegeWiseData?.reduce((acc: any, curr:any) => acc + curr.participantCount, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ParticipantsCount
