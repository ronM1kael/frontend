import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

import baseURL from "../../assets/common/baseurl";

import AuthGlobal from "../../Context/Store/AuthGlobal";

const Dashboard = () => {
  const [userCounts, setUserCounts] = useState({});
  const [error, setError] = useState(null);

  const context = useContext(AuthGlobal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwt');
        const userProfile = context.stateUser.userProfile;

        if (jwtToken && context.stateUser.isAuthenticated && userProfile && userProfile.id) {
          const userCountsResponse = await axios.get(`${baseURL}count-request`);
          setUserCounts(userCountsResponse.data);
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [context.stateUser.isAuthenticated, context.stateUser.userProfile]);

  const processUserCountsForChart = () => {
    const chartData = {
      labels: ['1st', '2nd', '3rd' , '4th' , '5th'],
      datasets: [
        {
          data: [
            userCounts.Submission_Frequent_1ST || 0,
            userCounts.Submission_Frequent_2ND || 0,
            userCounts.Submission_Frequent_3RD || 0,
            userCounts.Submission_Frequent_4th || 0,
            userCounts.Submission_Frequent_5th || 0,
          ],
        },
      ],
    };

    return chartData;
  };

  return (
    <ScrollView>
      <View>
        {userCounts.Submission_Frequent_1ST || userCounts.Submission_Frequent_2ND || userCounts.Submission_Frequent_3RD || userCounts.Submission_Frequent_4th || userCounts.Submission_Frequent_5th ? (
          <View>
            <Text>Request Chart</Text>
            <BarChart
              data={processUserCountsForChart()}
              width={415}
              height={500}
              yAxisSuffix=""
              yAxisInterval={1}
              withVerticalLabels
              withHorizontalLabels
              chartConfig={{
                backgroundGradientFrom: '#800000',
                backgroundGradientTo: '#800000',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#fff',
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        ) : (
          <Text>No data available for the charts</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;