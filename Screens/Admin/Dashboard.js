import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';

import baseURL from "../../assets/common/baseurl";

import { LineChart, BarChart, PieChart, StackedBarChart } from 'react-native-chart-kit';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [filter, setFilter] = useState('all'); // Added filter state

  const [applicationCount, setApplicationCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);
  const [filterapplication, setFilterApplication] = useState('all'); // Added filter state

  const [researchCount, setResearchCount] = useState(0);
  const [eaadResearchCount, setEAADResearchCount] = useState(0);
  const [maadResearchCount, setMAADResearchCount] = useState(0);
  const [basdResearchCount, setBASDResearchCount] = useState(0);
  const [caadResearchCount, setCAADResearchCount] = useState('all');
  const [filterresearch, setFilterResearch] = useState('all'); // Added filter state

  const [rolesChartData, setRolesChartData] = useState([]);
  const [applicationsStatusChartData, setApplicationsStatusChartData] = useState([]);
  const [thesisTypeChartData, setThesisTypeChartData] = useState([]);
  const [courseChartData, setCourseChartData] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [researchDepartmentChartData, setResearchDepartmentChartData] = useState([]);
  const [researchCourseChartData, setResearchCourseChartData] = useState([]);

  // Fetch data from your backend using Axios
  useEffect(() => {
    // Replace 'your-api-endpoint/dashboardmobile' with your actual API endpoint
    axios.get(`${baseURL}dashboardmobile`)
      .then((response) => {
        const data = response.data;
        setUsersCount(data.usersCount);
        setStudentCount(data.studentCount);
        setStaffCount(data.staffCount);
        setFacultyCount(data.facultyCount);

        setApplicationCount(data.applicationCount);
        setPendingCount(data.pendingCount);
        setPassedCount(data.passedCount);
        setReturnedCount(data.returnedCount);

        setResearchCount(data.researchCount);
        setEAADResearchCount(data.eaadResearchCount);
        setMAADResearchCount(data.maadResearchCount);
        setBASDResearchCount(data.basdResearchCount);
        setCAADResearchCount(data.caadResearchCount);

        setUsersCount(data.usersCount);
        setRolesChartData(data.rolesCount);
        setApplicationsStatusChartData(data.applicationsCount);
        setThesisTypeChartData(data.thesisTypeCount);
        setCourseChartData(data.courseCount);
        setTotalCourses(data.totalCourses);
        setResearchDepartmentChartData(data.researchDepartmentCount);
        setResearchCourseChartData(data.researchCourseCount);
        // Add more state variables based on your data structure
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const displayUserCount = () => {
    let count;

    switch (filter) {
      case 'all':
        count = usersCount;
        break;
      case 'student':
        count = studentCount;
        break;
      case 'staff':
        count = staffCount;
        break;
      case 'faculty':
        count = facultyCount;
        break;
      default:
        count = 0;
    }

    // Update the user count
    // You may want to use state for updating counts in a real-world scenario
    alert(`User Count: ${count}, Filter: ${filter}`);
  };

  const displayApplicationCount = () => {
    let countapplication;

    switch (filterapplication) {
      case 'all':
        countapplication = applicationCount;
        break;
      case 'pending':
        countapplication = pendingCount;
        break;
      case 'passed':
        countapplication = passedCount;
        break;
      case 'returned':
        countapplication = returnedCount;
        break;
      default:
        countapplication = 0;
    }

    // Update the user count
    // You may want to use state for updating counts in a real-world scenario
    alert(`Application Count: ${countapplication}, Filter: ${filterapplication}`);
  };

  const displayResearchCount = () => {
    let countresearch;

    switch (filterresearch) {
      case 'all':
        countresearch = researchCount;
        break;
      case 'eaad':
        countresearch = eaadResearchCount;
        break;
      case 'caad':
        countresearch = caadResearchCount;
        break;
      case 'maad':
        countresearch = maadResearchCount;
        break;
      case 'basd':
        countresearch = basdResearchCount;
        break;
      default:
        countresearch = 0;
    }

    // Update the user count
    // You may want to use state for updating counts in a real-world scenario
    alert(`Research Count: ${countresearch}, Filter: ${filterresearch}`);
  };

  // Function to change the filter
  const changeFilter = () => {
    switch (filter) {
      case 'all':
        setFilter('student');
        break;
      case 'student':
        setFilter('staff');
        break;
      case 'staff':
        setFilter('faculty');
        break;
      case 'faculty':
        setFilter('all');
        break;
      default:
        setFilter('all');
    }
  };

  const changeApplicationFilter = () => {
    switch (filterapplication) {
      case 'all':
        setFilterApplication('pending');
        break;
      case 'pending':
        setFilterApplication('passed');
        break;
      case 'passed':
        setFilterApplication('returned');
        break;
      case 'returned':
        setFilterApplication('all');
        break;
      default:
        setFilterApplication('all');
    }
  };

  const changeResearchFilter = () => {
    switch (filterresearch) {
      case 'all':
        setFilterResearch('eaad');
        break;
      case 'eaad':
        setFilterResearch('caad');
        break;
      case 'caad':
        setFilterResearch('maad');
        break;
      case 'maad':
        setFilterResearch('basd');
        break;
      case 'basd':
        setFilterResearch('all');
        break;
      default:
        setFilterResearch('all');
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const RolesLineChart = () => {
    if (rolesChartData.length === 0) {
      return null; // or a loading indicator
    }
  
    const chartData = {
      labels: rolesChartData.map((item) => item.role),
      datasets: [
        {
          data: rolesChartData.map((item) => item.count),
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  
    return (
      <LineChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  const ApplicationsStatusBarChart = () => {
    if (applicationsStatusChartData.length === 0) {
      return null; // or a loading indicator
    }
  
    const chartData = {
      labels: applicationsStatusChartData.map((item) => item.status),
      datasets: [
        {
          data: applicationsStatusChartData.map((item) => item.count),
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        },
      ],
    };
  
    return (
      <BarChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  const ThesisTypePieChart = () => {
    if (thesisTypeChartData.length === 0) {
      return null; // or a loading indicator
    }
  
    const chartData = thesisTypeChartData.map((item) => ({
      name: item.thesis_type,
      count: item.count,
      color: getRandomColor(),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  
    return (
      <PieChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const CourseChart = () => {
    if (courseChartData.length === 0) {
      return null; // or a loading indicator
    }
  
    const chartData = {
      labels: courseChartData.map((item) => item.course),
      legend: courseChartData.map((item) => item.course),
      data: courseChartData.map((item) => [item.count]),
      barColors: courseChartData.map(() => getRandomColor()), // Define getRandomColor function
    };
  
    return (
      <StackedBarChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  const ResearchDepartmentBarChart = () => {
    if (researchDepartmentChartData.length === 0) {
      return null; // or a loading indicator
    }

    const chartData = {
      labels: researchDepartmentChartData.map((item) => item.department),
      datasets: [
        {
          data: researchDepartmentChartData.map((item) => item.count),
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        },
      ],
    };

    return (
      <BarChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  const ResearchCourseLineChart = () => {
    if (researchCourseChartData.length === 0) {
      return null; // or a loading indicator
    }

    const chartData = {
      labels: researchCourseChartData.map((item) => item.course),
      datasets: [
        {
          data: researchCourseChartData.map((item) => item.count),
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    return (
      <LineChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: 'https://www.bootdey.com/image/280x280/ffb3ff/000000' }} style={styles.backgroundImage} />
      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>User Role:</Text>
            <Text style={styles.itemPrice}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} title="Change Filter" onPress={changeFilter}>
            <Text style={styles.buttonText}>Change Role</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={displayUserCount}>
            <Text style={styles.buttonText}>Display User Count</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>Application Status:</Text>
            <Text style={styles.itemPrice}>{filterapplication.charAt(0).toUpperCase() + filterapplication.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} title="Change Filter" onPress={changeApplicationFilter}>
            <Text style={styles.buttonText}>Change Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={displayApplicationCount}>
            <Text style={styles.buttonText}>Display Application Count</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>Research Department:</Text>
            <Text style={styles.itemPrice}>{filterresearch.charAt(0).toUpperCase() + filterresearch.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} title="Change Filter" onPress={changeResearchFilter}>
            <Text style={styles.buttonText}>Change Department</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={displayResearchCount}>
            <Text style={styles.buttonText}>Display Research Count</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RolesLineChart />
      <ApplicationsStatusBarChart />
      <ThesisTypePieChart />
      <CourseChart />
      <ResearchDepartmentBarChart />
      <ResearchCourseLineChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#fff',
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#999',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FFC107',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;